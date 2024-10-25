function probability(elo1: number, elo2: number) {
    return 1 / (1 + 10 ** ((elo1 - elo2) / 400));
}

export function eloWinner(elo1: number, elo2: number, outcome: number) {
    const pBlue = probability(elo2, elo1);
    const pRed = 1 - pBlue;

    const K = 60

    const p1elo = Math.round(elo1 + K * (outcome - pBlue))
    const p2elo = Math.round(elo2 + K * ((1 - outcome) - pRed))
    return {p1elo, p2elo}
}
