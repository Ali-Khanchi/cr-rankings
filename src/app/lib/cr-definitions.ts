export type PlayerData = {
    id: string;
    name: string;
    elo: number;
    tag: string;
}

export type BattleResult = {
    player1: string;
    player2: string;
    outcome: boolean;
    ts: number | string;
    p1elo: number;
    p2elo: number;
    p1tag: string
}

export type Battle = {
    battleTime: string | number;
    team: PlayerBattleData[];
    opponent: PlayerBattleData[];
}

export type RecordedBattle = {
    p1: PlayerData;
    p2: PlayerData;
    winner: PlayerData;
    p1old: number;
    p2old: number;
    p1new: number;
    p2new: number;
    ts: number | string;
}

export type PlayerBattleData = {
    crowns: number;
    name: string;
    tag: string;
}
