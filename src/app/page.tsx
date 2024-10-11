import Link from "next/link";
import { fetchRankings } from "@/app/lib/data";

export default async function Home() {
    const rankData = await fetchRankings();

    const rankings = rankData
        .sort((a, b) => b.elo - a.elo)
        .map((rank, index) => {
            return (
                <div
                    key={index}
                    className="flex justify-between items-center p-2 mb-2 bg-gray-800 text-white rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                >
                    <span className="font-semibold text-lg">{rank.name}</span>
                    <span className="text-amber-400 font-bold">{rank.elo}</span>
                </div>
            );
        });

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white flex flex-col items-center justify-center p-6">
            <main className="w-full max-w-md mx-auto text-center">
                <nav className="flex justify-center space-x-4 mb-8">
                    <Link href="/update">
                        <a className="text-blue-500 hover:text-blue-400 underline transform transition duration-300 hover:scale-110">
                            Update Rankings
                        </a>
                    </Link>
                    <Link href="/logs">
                        <a className="text-blue-500 hover:text-blue-400 underline transform transition duration-300 hover:scale-110">
                            Battle Log
                        </a>
                    </Link>
                </nav>

                <h1 className="text-4xl font-extrabold mb-10 animate-pulse">🏆 Rankings 🏆</h1>

                <div className="w-64 mx-auto">
                    {rankings}
                </div>
            </main>
        </div>
    );
}
