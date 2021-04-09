class AdvancePhaseEvent extends GameEvent {


    populateFromArgs(args: {}): void {
    }

    getId(): number {
        return EventIds.ADVANCE_PHASE;
    }

    execute(gameDTO: GameDTO): void {
        if (gameDTO.state.phase == Phase.ACTION) {
            gameDTO.state.phase = Phase.BUY;
        }
        else if (gameDTO.state.phase == Phase.BUY) {
            gameDTO.state.phase = Phase.CLEAN_UP;
        }
        else if (gameDTO.state.phase == Phase.CLEAN_UP) {
            gameDTO.state.phase = Phase.ACTION;
            GameDTOAccess.changeTurns(gameDTO);
        }
        Log.send("Phase is now " + Phase[gameDTO.state.phase]);
    }


}

RegisterEvent(AdvancePhaseEvent);