'use client';

import Link from "next/link";
import { useState } from "react";
import { updatePlayerWithAPI } from "@/app/lib/actions";
import { Button } from "@/app/lib/button";
import { RecordedBattle } from "@/app/lib/cr-definitions";

export default function UpdateRankings() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState<RecordedBattle[]>([]);

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            setResults(await updatePlayerWithAPI());
        } catch (error) {
            console.error("Failed to update players", error);
        }
        setIsSubmitting(false);
    };

    const battleLog = results.map((battle) => {
        const outcome = battle.winner.id === battle.p1.id;
        return (
            <div key={battle.ts + battle.winner.id} className="p-4 mb-4 bg-gray-800 rounded-lg shadow-md w-full">
                <div className="flex justify-between font-mono text-lg text-gray-200">
                    <span>{new Date(battle.ts).toDateString()}</span>
                </div>
                <div className="flex justify-between font-mono text-lg">
                    <span className={`flex-1 ${outcome ? "text-amber-400" : ""}`}>{battle.p1.name}</span>
                    <span className={`${outcome ? "text-green-500" : "text-red-500"}`}>
                        {battle.p1old} &rarr; {battle.p1new}
                    </span>
                </div>
                <div className="flex justify-between font-mono text-lg">
                    <span className={`flex-1 ${!outcome ? "text-amber-400" : ""}`}>{battle.p2.name}</span>
                    <span className={`${!outcome ? "text-green-500" : "text-red-500"}`}>
                        {battle.p2old} &rarr; {battle.p2new}
                    </span>
                </div>
            </div>
        );
    });

    let buttonText;
    if (!isSubmitting) {
        buttonText = "Update Players";
    } else if (results.length === 0) {
        buttonText = "Updating...";
    } else {
        buttonText = "Updated!";
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white flex flex-col items-center justify-center p-6">
            <main className="w-full max-w-lg mx-auto text-center">
                {/* Navigation link */}
                <nav className="mb-8">
                    <Link href="/">
                        <a className="text-blue-500 hover:text-blue-400 underline transform transition duration-300 hover:scale-110">
                            See the Rankings!!
                        </a>
                    </Link>
                </nav>

                {/* Title */}
                <h1 className="text-4xl font-extrabold mb-5 animate-pulse">Update Rankings</h1>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mb-10">
                    <div className="flex justify-center">
                        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-500 transition duration-300">
                            {buttonText}
                        </Button>
                    </div>
                </form>

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
