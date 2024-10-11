'use client';

import Link from "next/link";
import {useState} from "react";
import {updatePlayerWithAPI} from "@/app/lib/actions";
import {Button} from "@/app/lib/button";
import {RecordedBattle} from "@/app/lib/cr-definitions";

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
    };

    const battleLog = results.map((battle) => {
        const outcome = battle.winner.id === battle.p1.id
        return (
            <div key={battle.ts + battle.winner.id}>
                <div className={"flex font-mono text-xl"}>
                    <span className={`flex-1`}>{new Date(battle.ts).toDateString()}</span>
                </div>
                <div className={"flex font-mono text-xl"}>
                    <span className={`flex-1 ${outcome ? "text-amber-500" : ""}`}>{battle.p1.name}</span>
                    <span
                        className={`${outcome ? "text-green-500" : "text-red-500"}`}>{battle.p1old} ={">"} {battle.p1new} </span>
                </div>
                <div className={"flex font-mono text-xl"}>
                    <span className={`flex-1 ${!outcome ? "text-amber-500" : ""}`}>{battle.p2.name}</span>
                    <span
                        className={`${!outcome ? "text-green-500" : "text-red-500"}`}>{battle.p2old} ={">"} {battle.p2new} </span>
                </div>
                <br/>
            </div>
        )
    })

    let buttonText
    if (!isSubmitting) {
        buttonText = "Update Players"
    } else if (results.length === 0) {
        buttonText = "Updating..."
    } else {
        buttonText = "Updated!"
    }

    return (
        <div>
            <main>
                <Link href={"/"} className={"text-blue-600 underline m-5"}>See the Rankings!!</Link>
                <h1 className={"text-3xl text-center mb-5"}>Update</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex rounded-md bg-gray-50 p-4 md:p-6 justify-center">
                        <Button type="submit" disabled={isSubmitting}>
                            {buttonText}
                        </Button>
                    </div>
                </form>
                <div className="flex flex-col items-center justify-center">
                    <h1 className={"text-3xl text-center mb-10"}>Results</h1>
                    <div className={"w-56"}>
                        {battleLog}
                    </div>
                </div>
            </main>
        </div>
    );
}
