'use server';

import {revalidatePath} from "next/cache";
import {Battle, BattleResult, RecordedBattle} from "@/app/lib/cr-definitions";
import {fetchBattleResults, fetchRankings} from "@/app/lib/data";
import {sql} from "@vercel/postgres";

function probability(elo1: number, elo2: number) {
    return 1 / (1 + 10 ** ((elo1 - elo2) / 400));
}

function parseTimestamp(timestamp: string | number): Date {
    // If the input is already a Date object, return it directly
    if (typeof timestamp === "number") {
        return new Date(timestamp);
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

    const K = 60

    const p1elo = Math.round(elo1 + K * (outcome - pBlue))
    const p2elo = Math.round(elo2 + K * ((1 - outcome) - pRed))
    return {p1elo, p2elo}
}

export async function updatePlayerWithAPI() {
    const players = await fetchRankings()
    const battleResults: BattleResult[] = await fetchBattleResults()
    const dataList: Battle[] = []

    const token = process.env.CR_TOKEN;
    for (let i = 0; i < players.length; i++) {
        const url = `https://proxy.royaleapi.dev/v1/players/%23${players[i].tag}/battlelog`
        const t = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data: Battle[] = (await t.json())
        dataList.push(...data)
    }

    const battleData: Battle[] = dataList
        .filter(b => b.opponent.length === 1 && players.find(p => `#${p.tag}` === b.opponent[0].tag))
        .map(b => {return {team: b.team, opponent: b.opponent, battleTime: parseTimestamp(b.battleTime).getTime()}})
        .sort((a, b) => a.battleTime - b.battleTime)

    const recorded: RecordedBattle[] = []
    for (const battle of battleData) {
        const i = players.findIndex(p => `#${p.tag}` === battle.team[0].tag)
        const j = players.findIndex(p => `#${p.tag}` === battle.opponent[0].tag)
        if (i === -1 || j === -1) {
            continue
        }

        if (battleResults.find(br => br.ts == battle.battleTime && (br.player1 == players[i].id || br.player2 == players[i].id)) !== undefined) {
            continue
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
            VALUES (${players[i].id}, ${players[j].id}, ${winner === 1}, ${battle.battleTime}, ${players[i].elo},
                    ${players[j].elo})
        `;

        // console.log(`Updated player ${players[i].name} from ${players[i].elo} to ${p1elo}`);
        // console.log(`Updated player ${players[j].name} from ${players[j].elo} to ${p2elo}`);

        battleResults.push({player1: players[i].id, player2: players[j].id, outcome: winner === 1, ts: battle.battleTime, p1elo: players[i].elo, p2elo: players[j].elo})
        recorded.push({p1: players[i], p2: players[j], winner: winner === 1 ? players[i] : players[j], p1old: players[i].elo, p2old: players[j].elo, p1new: p1elo, p2new: p2elo, ts: battle.battleTime})
        players[i].elo = p1elo
        players[j].elo = p2elo
    }

    console.log(`${Date()} :: Recorded ${recorded.length} new battles.`)
    revalidatePath('/');

    return recorded.reverse()
}
