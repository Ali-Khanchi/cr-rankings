import Link from "next/link";
import Form from "@/app/ui/create-form";
import {fetchRankings} from "@/app/lib/data";

export default async function UpdateRankings() {
    const players = await fetchRankings()

    return (
        <div>
            <main>
                <Link href={"/"} className={"text-blue-600 underline"}>See the Rankings!!</Link>
                <h1 className={"text-3xl text-center"}>Update</h1>
                <Form players={players}></Form>
            </main>
        </div>
    );
}
