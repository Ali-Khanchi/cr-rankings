import Link from "next/link";
import {fetchBattleResults, fetchRankings} from "@/app/lib/data";
import {PlayerData} from "@/app/lib/cr-definitions";
import {eloWinner} from "@/app/lib/elo-calc";

export default async function BattleLogs() {

    const results = await fetchBattleResults();
    const players = await fetchRankings();
    const playerMap = new Map<string, PlayerData>();
    players.map(p => {
        playerMap.set(p.id, p)
    })

    const battleLog = results.map((battle) => {
        const {p1elo: p1new, p2elo: p2new} = eloWinner(battle.p1elo, battle.p2elo, + battle.outcome)
        const outcome = + battle.outcome
        return (
            <div key={battle.ts + battle.player1}>
                <div className={"flex font-mono text-xl"}>
                    <span className={`flex-1`}>{new Date(battle.ts).toDateString()}</span>
                </div>
                <div className={"flex font-mono text-xl"}>
                    <span className={`flex-1 ${outcome ? "text-amber-500" : ""}`}>{playerMap.get(battle.player1)?.name}</span>
                    <span
                        className={`${outcome ? "text-green-500" : "text-red-500"}`}>{battle.p1elo} ={">"} {p1new} </span>
                </div>
                <div className={"flex font-mono text-xl"}>
                    <span className={`flex-1 ${!outcome ? "text-amber-500" : ""}`}>{playerMap.get(battle.player2)?.name}</span>
                    <span
                        className={`${!outcome ? "text-green-500" : "text-red-500"}`}>{battle.p2elo} ={">"} {p2new} </span>
                </div>
                <br/>
            </div>
        )
    })

    return (
        <div>
            <main>
                <Link href={"/"} className={"text-blue-600 underline m-5"}>See the Rankings!!</Link>
                <div className="flex flex-col items-center justify-center">
                    <h1 className={"text-3xl text-center mb-10"}>Results</h1>
                    <div className={"w-56"}>
                        {battleLog.length === 0 ? "No new results." : battleLog}
                    </div>
                </div>
            </main>
        </div>
    );
}
