class PossibleMovesMessenger {
    static POSSIBLE_MOVES: string = "POSSIBLE_MOVES"

    static send(moves: any[]) {
        MessagingCenter.notify(PossibleMovesMessenger.POSSIBLE_MOVES, moves);
    }

    static subscribe(callback: (moves: any[]) => void) {
        MessagingCenter.addListener(PossibleMovesMessenger.POSSIBLE_MOVES, callback, false);
    }
}



