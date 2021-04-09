///<reference path="../LogicalStep.ts" />

enum PlayerChoiceType {
    CARD,
    STRING
}

enum PlayerChoicePrepositionValues {
    EXACTLY,
    UP_TO
}


class PlayerChoicePreposition {
    type: PlayerChoicePrepositionValues;
    value: LogicalVariable;

    constructor(type: PlayerChoicePrepositionValues, value: LogicalVariable) {
        this.value = value;
        this.type = type;
    }
}


class PlayerChoiceStep extends LogicalStep {

    playerUUID: LogicalVariable;
    choiceType: PlayerChoiceType;
    options: LogicalVariable;
    logicalBufferReturnKey: string;
    preposition: PlayerChoicePreposition;
    hasBeenFulfilled = false;
    displayText: string;

    constructor(playerUUID: LogicalVariable, choiceType: PlayerChoiceType, options: LogicalVariable, preposition: PlayerChoicePreposition, logicalBufferReturnKey: string, displayText: string) {
        super();
        this.playerUUID = playerUUID;
        this.choiceType = choiceType;
        this.options = options;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
        this.preposition = preposition;
        this.displayText = displayText;
    }

    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        /*var _ = new LogicalUtils();
        PlayerChoiceNotify.send(_.ResolveVariable(this.playerUUID, logicalBuffer), _.ResolveVariable(this.options, logicalBuffer), this.preposition.type, _.ResolveVariable(this.preposition.value, logicalBuffer));
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.fname(_.ResolveVariable(this.playerUUID, logicalBuffer)) + " chooses " + logicalBuffer.storedData[this.logicalBufferReturnKey]);
        var stack = GameDTOAccess.getLogicalStack(gameDTO);
        var topBuffer = stack.buffers[stack.buffers.length - 1];
        var currentStep = GameDTOAccess.traverseLogicalStep(gameDTO, topBuffer, topBuffer.getCurrentStep());*/
        var lu = new LoggingUtils(gameDTO);
        var _ = new LogicalUtils();
        if (this.hasBeenFulfilled) {
            Log.send(lu.fname(_.ResolveVariable(this.playerUUID, logicalBuffer)) + " chooses " + logicalBuffer.storedData[this.logicalBufferReturnKey]);
            return true;
        }
        else {
            GameDTOAccess.setState(gameDTO, GameState.WAITING_FOR_PLAYER_CHOICE);
            return false;
        }
    }

    fulfill(answers: any, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        if (answers.length == 1) {
            logicalBuffer.storedData[this.logicalBufferReturnKey] = answers[0];
        }
        else {
            logicalBuffer.storedData[this.logicalBufferReturnKey] = answers;
        }
        this.hasBeenFulfilled = true;
        GameDTOAccess.updateLogicalBuffer(gameDTO, logicalBuffer);
    }

    getStepId(): StepId {
        return StepId.PLAYER_CHOICE;
    }
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.playerUUID = LogicalVariable.generateFromDTO(dto.args["playerUUID"]);
        this.choiceType = dto.args["choiceType"];
        this.options = LogicalVariable.generateFromDTO(dto.args["options"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
        this.preposition = dto.args["preposition"];
        this.hasBeenFulfilled = dto.args["hasBeenFulfilled"];
        this.displayText = dto.args["displayText"];
    }

    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["choiceType"] = this.choiceType;
        dto.args["playerUUID"] = this.playerUUID;
        dto.args["options"] = this.options;
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        dto.args["preposition"] = this.preposition;
        dto.args["hasBeenFulfilled"] = this.hasBeenFulfilled;
        dto.args["displayText"] = this.displayText;
        return dto;
    }

    reset(): void {
        this.hasBeenFulfilled = false;
    }

    hasSubsteps(): boolean {
        return false;
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return null;
    }


}

RegisterEventBufferStep(PlayerChoiceStep);