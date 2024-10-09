'use client'

import Link from "next/link";
import {useState} from "react";

const initialRanks = [{name: "Ali", elo: 5000}, {name: "Ruben", elo: 4000}, {name: "Nadya", elo: 4000}, {name: "JC", elo: 2000}, {name: "Tom", elo: 1000}, {name: "Arnaud", elo: 1500}, {name: "Clement", elo: 15}]

export default function Home() {
    const [ranks, setRanks] = useState(initialRanks)

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
