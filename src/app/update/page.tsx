import Link from "next/link";
import {updatePlayerWithAPI} from "@/app/lib/actions";
import {Button} from "@/app/lib/button";

export default async function UpdateRankings() {
    return (
        <div>
            <main>
                <Link href={"/"} className={"text-blue-600 underline m-5"}>See the Rankings!!</Link>
                <h1 className={"text-3xl text-center mb-5"}>Update</h1>
                <form action={updatePlayerWithAPI}>
                    <div className="flex rounded-md bg-gray-50 p-4 md:p-6 justify-center">
                        <Button type="submit">Update Players</Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
