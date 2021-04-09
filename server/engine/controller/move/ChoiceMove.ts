///<reference path="Move.ts" />


class ChoiceMove extends Move {
    choices: any;
    options: any;
    maxChoicesNum: number;
    minChoicesNum: number;
    choiceString: string;
    choiceType: PlayerChoiceType;


    constructor(choiceType: PlayerChoiceType, choices: any, options: any, minChoicesNum: number, maxChoicesNum: number, choiceString: string) {
        super();
        this.choiceType = choiceType;
        this.choices = choices;
        this.options = options;
        this.minChoicesNum = minChoicesNum;
        this.maxChoicesNum = maxChoicesNum;
        this.choiceString = choiceString;
    }

    execute(gameDTO: GameDTO) {
        var stack = GameDTOAccess.getLogicalStack(gameDTO);
        var topBuffer = stack.buffers[stack.buffers.length - 1];
        var currentStep = GameDTOAccess.traverseLogicalStep(gameDTO, topBuffer, topBuffer.getCurrentStep());
        if (currentStep instanceof PlayerChoiceStep) {
            currentStep.fulfill(this.choices, topBuffer, gameDTO);
            GameDTOAccess.setState(gameDTO, GameState.RESOLVING_LOGICAL_STACK);
        }
    }

    getMoveType() {
        return MoveType.CHOICE;
    }


}

RegisterMove(ChoiceMove);