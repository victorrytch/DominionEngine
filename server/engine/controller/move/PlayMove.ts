class PlayMove extends Move {
    cardToPlay: string;

    constructor(cardToPlay: string) {
        super();
        this.cardToPlay = cardToPlay;
    }

    execute(gameDTO: GameDTO) {
        var _ = new LogicalUtils();
        var args = {};
        args[CardPlayedEvent.CARD_UUID] = this.cardToPlay;
        var playEvent = GameEvent.create(EventIds.CARD_PLAYED, args);
        GameDTOAccess.pushEventToStack(gameDTO, playEvent);
        GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
    }

    getMoveType() {
        return MoveType.PLAY;
    }

    toString(gameDTO: GameDTO): string {
        var lu = new LoggingUtils(gameDTO);
        return "Play " + lu.fname(this.cardToPlay);
    }

}

RegisterMove(PlayMove);