import Link from "next/link";
import {fetchRankings} from "@/app/lib/data";

export default async function Home() {

    const rankData = await fetchRankings();

    const rankings = rankData
        .sort((a, b) => b.elo - a.elo)
        .map((rank, index) => {
            return (
                <div key={index} className={"flex font-mono text-xl"}>
                    <span className={"flex-1"}>{rank.name}</span>
                    <span className={"text-amber-500"}>{rank.elo}</span>
                </div>
            );
        });

    return (
        <div>
            <main>
                <Link href={"/update"} className={"text-blue-600 underline"}>Update the Rankings!!</Link>
                <div className="flex flex-col items-center justify-center">
                    <h1 className={"text-3xl text-center mb-10"}>🏆 Rankings 🏆</h1>
                    <div className={"w-56"}>
                        {rankings}
                    </div>
                </div>
            </main>
        </div>
    );
}
