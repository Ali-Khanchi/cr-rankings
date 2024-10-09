import Link from "next/link";

export default function UpdateRankings() {
    return (
        <div>
            <main>
                <Link href={"/"} className={""}>See the Rankings!!</Link>
                <h1 className={"text-3xl text-center"}>Update</h1>
            </main>
        </div>
    );
}
