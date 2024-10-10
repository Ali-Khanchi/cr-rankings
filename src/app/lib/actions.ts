'use server';

import {sql} from "@vercel/postgres";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {Battle, BattleResult} from "@/app/lib/cr-definitions";
import {fetchBattleResults, fetchRankings} from "@/app/lib/data";

function probability(elo1: number, elo2: number) {
    return 1 / (1 + 10 ** ((elo1 - elo2) / 400));
}

function parseTimestamp(timestamp: string | Date) {
    // If the input is already a Date object, return it directly
    if (timestamp instanceof Date) {
        return timestamp;
    }

    // Ensure the timestamp is a string
    timestamp = String(timestamp);

    // Check if the format is 'YYYYMMDDTHHMMSS.000Z'
    if (/^\d{8}T\d{6}\.000Z$/.test(timestamp)) {
        // Convert 'YYYYMMDDTHHMMSS.000Z' to 'YYYY-MM-DDTHH:MM:SS.000Z'
        const year = timestamp.slice(0, 4);
        const month = timestamp.slice(4, 6);
        const day = timestamp.slice(6, 8);
        const hour = timestamp.slice(9, 11);
        const minute = timestamp.slice(11, 13);
        const second = timestamp.slice(13, 15);
        // Reformatted to ISO string
        timestamp = `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
    }

    // Convert to a Date object
    return new Date(timestamp);
}

function eloWinner(elo1: number, elo2: number, outcome: number) {
    const pBlue = probability(elo2, elo1);
    const pRed = 1 - pBlue;

    const K = 30

    const p1elo = Math.round ( elo1 + K * (outcome - pBlue) )
    const p2elo = Math.round ( elo2 + K * ((1 - outcome) - pRed) )
    return {p1elo, p2elo}
}

export async function updatePlayerWithAPI() {
    const players = await fetchRankings()
    const battleResults: BattleResult[] = await fetchBattleResults()

    const token = process.env.CR_TOKEN;
    for (let i = 0 ; i < players.length; i++) {
        const url = `https://api.clashroyale.com/v1/players/%23${players[i].tag}/battlelog`
        const t = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data: Battle[] = (await t.json())

        if (!data || data.length === 0) {
            continue;
        }

        for (let j = 0 ; j < players.length ; j++) {
            const commonBattles = data.filter(battle => battle.opponent.length === 1 && battle.opponent[0].tag === `#${players[j].tag}`)
            for (const battle of commonBattles) {
                const ts = parseTimestamp(battle.battleTime)

                const exists = battleResults.some(b => b.ts == ts.getTime() && (b.player1 == players[i].id || b.player2 == players[i].id));
                if (exists) {
                    continue;
                }
                const winner = battle.team[0].crowns > battle.opponent[0].crowns ? 1 : 0
                const {p1elo, p2elo} = eloWinner(players[i].elo, players[j].elo, winner)

                await sql`
                    UPDATE rankings
                    SET elo = ${p1elo}
                    WHERE id = ${players[i].id}
                `;

                await sql`
                    UPDATE rankings
                    SET elo = ${p2elo}
                    WHERE id = ${players[j].id}
                `;

                await sql`
                    INSERT INTO battles (player1, player2, outcome, ts, p1elo, p2elo)
                    VALUES (${players[i].id}, ${players[j].id}, ${winner === 1}, ${ts.getTime()}, ${players[i].elo}, ${players[j].elo})
                `;

                console.log(`Updated player ${players[i].name} from ${players[i].elo} to ${p1elo}`);
                console.log(`Updated player ${players[j].name} from ${players[j].elo} to ${p2elo}`);

                players[i].elo = p1elo
                players[j].elo = p2elo
            }
        }

    }
    revalidatePath('/');
    redirect('/');
}
