import {updatePlayerWithAPI} from "@/app/lib/actions";
import {Button} from "@/app/lib/button";
import {PlayerData} from "@/app/lib/cr-definitions";

export default function Form({players}: { players: PlayerData[] }) {
    return (
        <form action={updatePlayerWithAPI}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Player Name */}
                <div className="mb-4">
                    <label htmlFor="player" className="mb-2 block text-sm font-medium">
                        Choose players
                    </label>
                    <div className="relative">
                        <select
                            id="player1"
                            name="id1"
                            className="peer block w-full cursor-pointer border border-blue-500 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select a player
                            </option>
                            {players.map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="relative">
                        <select
                            id="player2"
                            name="id2"
                            className="peer block w-full cursor-pointer border border-red-500 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select a player
                            </option>
                            {players.map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Select Winner */}
                <div className="mb-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                        Choose winner
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input type="radio" id="blue" name="winner" value="blue"/>
                            <label htmlFor="blue">Blue</label><br/>
                            <input type="radio" id="red" name="winner" value="red"/>
                            <label htmlFor="red">Red</label><br/>
                        </div>
                    </div>
                </div>
                <Button type="submit">Update Player</Button>
            </div>
        </form>
    );
}
