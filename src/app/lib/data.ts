import { sql } from '@vercel/postgres';
import {BattleResult, PlayerData} from "@/app/lib/cr-definitions";

export async function fetchRankings() {
    try {
        const data = await sql<PlayerData>`SELECT * FROM rankings`;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch rankings data.');
    }
}

export async function fetchBattleResults() {
    try {
        const data = await sql<BattleResult>`SELECT * FROM battles`
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch battles data.');
    }
}
