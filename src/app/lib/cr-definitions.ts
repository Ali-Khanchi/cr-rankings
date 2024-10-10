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
    ts: number;
    p1elo: number;
    p2elo: number;
}

export type Battle = {
    battleTime: string;
    team: PlayerBattleData[];
    opponent: PlayerBattleData[];
}

export type PlayerBattleData = {
    crowns: number;
    name: string;
    tag: string;
}
