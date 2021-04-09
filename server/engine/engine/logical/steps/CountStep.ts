class CountStep extends LogicalStep {

    setOne: LogicalVariable;
    logicalBufferReturnKey: string;

    constructor(setOne: LogicalVariable, logicalBufferReturnKey: string) {
        super();
        this.setOne = setOne;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }

    hasSubsteps(): boolean {
        return true;
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return this;
    }

    reset(): void {
    }


    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        var _ = new LogicalUtils();
        var setArg: any[] = _.ResolveVariable(this.setOne, logicalBuffer);

        if (setArg == null || setArg == undefined) {
            logicalBuffer.storedData[this.logicalBufferReturnKey] = 0;
        }
        else {
            logicalBuffer.storedData[this.logicalBufferReturnKey] = setArg.length;
        }

        return true;
    }

    getStepId(): StepId {
        return StepId.COUNT;
    }
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.setOne = LogicalVariable.generateFromDTO(dto.args["setOne"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
    }
    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["setOne"] = this.setOne.convertToDTO();
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        return dto;
    }

}

RegisterEventBufferStep(CountStep);
