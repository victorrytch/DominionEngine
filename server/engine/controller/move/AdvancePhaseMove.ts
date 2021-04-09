///<reference path="Move.ts" />


class AdvancePhaseMove extends Move{

    execute(gameDTO: GameDTO) {
        var playEvent = GameEvent.create(EventIds.ADVANCE_PHASE, {});
        GameDTOAccess.pushEventToStack(gameDTO, playEvent);
        GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
        
    }

    getMoveType() {
        return MoveType.ADVANCE_PHASE;
    }


}

RegisterMove(AdvancePhaseMove);