class GameDriver {
    gameDTO: GameDTO;
    waiting = false;

    constructor(gameDTO: GameDTO) {
        if (gameDTO != null) {
            this.gameDTO = gameDTO;
        }
        else {
            this.gameDTO = new GameDTO();
        }
        var __this = this;
        DriverNotify.subscribe((message) => {
            __this.process();
        })
    }

    process() {
        var shouldContinue = true;
        while (shouldContinue) {
            shouldContinue = this.step();
        }
    }

    step() {
        var continueStep = false;

        var gameState = this.gameDTO.state.state;
        var gameDTO = this.gameDTO;;
        if (gameState == GameState.START) {
            GamePopulator.populate(gameDTO);
            GamePopulator.setFirstTurn(gameDTO);
        }
        if (GameDTOAccess.isGameOver(gameDTO)) {
            GameDTOAccess.setState(gameDTO, GameState.END);
        }
        else if (GameDTOAccess.isLogicalStackCleared(gameDTO) &&
            GameDTOAccess.isEventStackCleared(gameDTO) &&
            GameDTOAccess.isReactionStackCleared(gameDTO)) {
            GameDTOAccess.setState(gameDTO, GameState.TURN_WAITING);
        }

        if (gameState == GameState.RESOLVING_LOGICAL_STACK) {
            if (!GameDTOAccess.isLogicalStackCleared(gameDTO)) {
                var logicalStack: LogicalStack = GameDTOAccess.getLogicalStack(gameDTO);
                var output = logicalStack.processAndAdvance(gameDTO);
                if (output.eventsGenerated) {
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
                }
                else if (output.isCurrentBufferComplete) {
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_REACTION_STACK);
                }
            }
            else {
                GameDTOAccess.setState(gameDTO, GameState.RESOLVING_REACTION_STACK);
            }
            continueStep = true;
        }
        else if (gameState == GameState.RESOLVING_EVENT_STACK) {
            if (!GameDTOAccess.isEventStackCleared(gameDTO)) {
                var eventStack: EventStack = GameDTOAccess.getEventStack(gameDTO);
                var eventStackOutput = eventStack.processAndAdvance(gameDTO);
                if (eventStackOutput.reactionsGenerated) {
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_REACTION_STACK);
                }
                else if (eventStackOutput.isCurrentBufferComplete) {
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_LOGICAL_STACK);
                }
            }
            else {
                GameDTOAccess.setState(gameDTO, GameState.RESOLVING_LOGICAL_STACK);
            }
            continueStep = true;
        }
        else if (gameState == GameState.RESOLVING_REACTION_STACK) {
            if (!GameDTOAccess.isReactionStackCleared(gameDTO)) {
                var reactionStack: ReactionStack = GameDTOAccess.getReactionStack(gameDTO);
                var reactionStackOutput = reactionStack.processAndAdvance(gameDTO);
                if (reactionStackOutput.createdLogicalOutput) {
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_LOGICAL_STACK);
                }
                else if (reactionStackOutput.currentBufferFinished) {
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
                }
            }
            else {
                GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
            }
            continueStep = true;
        }

        if (gameState == GameState.TURN_WAITING || gameState == GameState.WAITING_FOR_PLAYER_CHOICE) {

            continueStep = false;
        }
   
        return continueStep;
    }

}

enum GameState {
    NOT_STARTED,
    START,
    TURN_WAITING,
    RESOLVING_LOGICAL_STACK,
    RESOLVING_REACTION_STACK,
    RESOLVING_EVENT_STACK,
    WAITING_FOR_PLAYER_CHOICE,
    END
}