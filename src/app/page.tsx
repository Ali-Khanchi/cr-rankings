'use client'

import Link from "next/link";
import {useState} from "react";

const initialRanks = [
    {name: "Ali", elo: 2780},
    {name: "Max", elo: 2470},
    {name: "Tom", elo: 2343},
    {name: "Ruben", elo: 2200},
    {name: "Arnaud", elo: 2030},
    {name: "Clement", elo: 2000},
    {name: "Harmen", elo: 1700},
    {name: "Nico", elo: 1600},
    {name: "Nadya", elo: 1200},
    {name: "Steph", elo: 1050},
    {name: "JC", elo: 1000},
    {name: "Lil bro", elo: 800},
    {name: "Gabi", elo: 400},
]

export default function Home() {
    const [ranks] = useState(initialRanks)

    const rankings = ranks
        .sort((a, b) => b.elo - a.elo)
        .map((rank, index) => {
            return (
                <div key={index} className={"text-center flex-row"}>
                    <h2 className={"text-2xl"}>{rank.name} - {rank.elo}</h2>
                </div>
            )
        })

    return (
        <div>
            <main>
                <Link href={"/update"} className={""}>Update the Rankings!!</Link>
                <h1 className={"text-3xl text-center"}>Rankings</h1>
                {rankings}
            </main>
        </div>
    );
}
