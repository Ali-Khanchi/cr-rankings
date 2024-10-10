'use server';
import { z } from 'zod';
import {sql} from "@vercel/postgres";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {PlayerData} from "@/app/lib/cr-definitions";

const FormSchema = z.object({
    id1: z.string(),
    id2: z.string(),
    winner: z.string()
});

function probability(elo1: number, elo2: number) {
    return 1 / (1 + 10 ** ((elo1 - elo2) / 400));
}

export async function updatePlayer(playerForm: FormData) {
    let parsed = undefined
    try {
         parsed = FormSchema.parse({
            id1: playerForm.get('id1'),
            id2: playerForm.get('id2'),
            winner: playerForm.get('winner'),
        });

         if (parsed.id1 === parsed.id2) {
            console.error('Players cannot be the same');
            return
         }
    } catch (error) {
        console.error('Invalid form data:', error);
        return
    }

    const id1 = parsed.id1;
    const id2 = parsed.id2;
    const winner = parsed.winner;

    const data1 = (await sql<PlayerData>`SELECT * FROM rankings WHERE id = ${id1}`).rows[0];
    const elo1 = data1.elo;

    const data2 = (await sql<PlayerData>`SELECT * FROM rankings WHERE id = ${id2}`).rows[0];
    const elo2 = data2.elo;

    const pBlue = probability(elo2, elo1);
    const pRed = 1 - pBlue;

    const K = 30
    const outcome = winner === 'blue' ? 1 : 0;

    const new1 = Math.round ( elo1 + K * (outcome - pBlue) )
    const new2 = Math.round ( elo2 + K * ((1 - outcome) - pRed) )

    await sql`
        UPDATE rankings
        SET elo = ${new1}
        WHERE id = ${id1}
    `;

    await sql`
        UPDATE rankings
        SET elo = ${new2}
        WHERE id = ${id2}
    `

    console.log(`Updated player ${data1.name} from ${elo1} to ${new1}`);
    console.log(`Updated player ${data2.name} from ${elo2} to ${new2}`);

    revalidatePath('/');
    redirect('/');
}
