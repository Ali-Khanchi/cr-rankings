import Link from "next/link";
import {fetchBattleResults, fetchRankings} from "@/app/lib/data";
import {PlayerData} from "@/app/lib/cr-definitions";
import {eloWinner} from "@/app/lib/elo-calc";

export default async function BattleLogs() {

    const results = (await fetchBattleResults()).reverse();
    const players = await fetchRankings();
    const playerMap = new Map<number, PlayerData>();
    players.map(p => {
        playerMap.set(parseInt(p.id,10), p)
    })

    const battleLog = results.map((battle) => {
        const {p1elo: p1new, p2elo: p2new} = eloWinner(battle.p1elo, battle.p2elo, + battle.outcome)
        const outcome = + battle.outcome
        return (
            <div key={battle.ts + battle.player1}>
                <div className={"flex font-mono text-xl"}>
                    <span className={`flex-1`}>{new Date(Number(battle.ts)).toDateString()}</span>
                </div>
                <div className={"flex font-mono text-xl"}>
                    <span className={`flex-1 ${outcome ? "text-amber-500" : ""}`}>{playerMap.get(parseInt(battle.player1,10))?.name}</span>
                    <span
                        className={`${outcome ? "text-green-500" : "text-red-500"}`}>{battle.p1elo} ={">"} {p1new} </span>
                </div>
                <div className={"flex font-mono text-xl"}>
                    <span className={`flex-1 ${!outcome ? "text-amber-500" : ""}`}>{playerMap.get(parseInt(battle.player2,10))?.name}</span>
                    <span
                        className={`${!outcome ? "text-green-500" : "text-red-500"}`}>{battle.p2elo} ={">"} {p2new} </span>
                </div>
                <br/>
            </div>
        )
    })

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white flex flex-col items-center justify-center p-6">
            <main className="w-full max-w-lg mx-auto text-center">
                {/* Navigation link */}
                <nav className="mb-8">
                    <Link href="/" className="text-blue-500 hover:text-blue-400 underline transform transition duration-300 hover:scale-110">
                        See the Rankings!!
                    </Link>
                </nav>

                {/* Title */}
                <h1 className="text-4xl font-extrabold mb-5 animate-pulse">Battle Log</h1>

                {/* Results */}
                <div className="w-full">
                    <h2 className="text-3xl font-semibold mb-5">Results</h2>
                    <div className="w-full">
                        {battleLog.length === 0 ? (
                            <p className="text-gray-400">No new results.</p>
                        ) : (
                            <div className="space-y-4">{battleLog}</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
