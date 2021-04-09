///<reference path="../LogicalStep.ts" />

enum LoadHandInfoStepOptions {
    ALL,
    SIZE
}

class LoadHandInfoStep extends LogicalStep {

    option: LoadHandInfoStepOptions;
    logicalBufferReferencePlayerUUID: LogicalVariable;
    logicalBufferReturnKey: string;

    constructor(option: LoadHandInfoStepOptions, logicalBufferReferencePlayerUUID: LogicalVariable, logicalBufferReturnKey: string) {
        super();
        this.option = option;
        this.logicalBufferReferencePlayerUUID = logicalBufferReferencePlayerUUID;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }

    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        var _ = new LogicalUtils();
        var playerUUID = _.ResolveVariable(this.logicalBufferReferencePlayerUUID, logicalBuffer);

        var requestedInfo = null;

        if (this.option == LoadHandInfoStepOptions.SIZE) {
            requestedInfo = GameDTOAccess.getCardsInZone(gameDTO, playerUUID, Zones.HAND).length;
            //Log.send("Hand size requested: " + requestedInfo);
        }
        else if (this.option == LoadHandInfoStepOptions.ALL) {
            requestedInfo = GameDTOAccess.getCardsInZone(gameDTO, playerUUID, Zones.HAND);
        }

        logicalBuffer.storedData[this.logicalBufferReturnKey] = requestedInfo;

        return true;
    }


    getStepId(): StepId {
        return StepId.LOAD_HAND;
    }
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.option = dto.args["option"];
        this.logicalBufferReferencePlayerUUID = LogicalVariable.generateFromDTO(dto.args["logicalBufferReferencePlayerUUID"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
    }
    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["option"] = this.option;
        dto.args["logicalBufferReferencePlayerUUID"] = this.logicalBufferReferencePlayerUUID.convertToDTO();
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        return dto;
    }


    reset(): void {

    }

    hasSubsteps(): boolean {
        return false;
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return this;
    }
}


RegisterEventBufferStep(LoadHandInfoStep);