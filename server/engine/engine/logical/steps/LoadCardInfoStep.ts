///<reference path="../LogicalStep.ts" />


enum LoadCardInfoStepOptions {
    TYPES,
    CARD_ID
}

class LoadCardInfoStep extends LogicalStep {
    option: LoadCardInfoStepOptions;
    logicalBufferReference: LogicalVariable;
    logicalBufferReturnKey: string;

    constructor(option: LoadCardInfoStepOptions, logicalBufferReference: LogicalVariable, logicalBufferReturnKey: string) {
        super();
        this.option = option;
        this.logicalBufferReference = logicalBufferReference;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }

    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        var _ = new LogicalUtils();
        var cardID = _.ResolveVariable(this.logicalBufferReference, logicalBuffer);

        var requestedInfo = null;

        if (this.option == LoadCardInfoStepOptions.TYPES) {

            requestedInfo = GameDTOAccess.getCardDefinition(gameDTO, cardID).getCardTypes();
            var lu = new LoggingUtils(gameDTO);
            //Log.send("Loading card type for " + lu.fname(cardID) + " : " + requestedInfo);
        }
        else if (this.option == LoadCardInfoStepOptions.CARD_ID) {
            requestedInfo = GameDTOAccess.getCardDefinition(gameDTO, cardID).getCardId();
        }

        logicalBuffer.storedData[this.logicalBufferReturnKey] = requestedInfo;

        return true;
    }


    reset(): void {
        
    }

    hasSubsteps(): boolean {
        return false;
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return this;
    }

    getStepId(): StepId {
        return StepId.LOAD_CARD;
    }

    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.option = dto.args["option"];
        this.logicalBufferReference = LogicalVariable.generateFromDTO(dto.args["logicalBufferReference"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
    }

    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["option"] = this.option;
        dto.args["logicalBufferReference"] = this.logicalBufferReference.convertToDTO();
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        return dto;
    }

}

RegisterEventBufferStep(LoadCardInfoStep);