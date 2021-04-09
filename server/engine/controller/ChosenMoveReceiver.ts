class ChosenMoveReceiver {

    receive(move: Move, gameDTO: GameDTO) {
        this.process(move, gameDTO);
    }

    validate() {

    }

    process(move: Move, gameDTO: GameDTO) {
        move.execute(gameDTO);
        GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
    }

}