enum ArrayStepOptions {
    ADD
}


class ArrayStep extends LogicalStep {
    option: ArrayStepOptions;
    logicalBufferReferenceValue: LogicalVariable;
    logicalBufferReturnKey: string;

    constructor(option: ArrayStepOptions, logicalBufferReferenceValue: LogicalVariable, logicalBufferReturnKey: string) {
        super();
        this.option = option;
        this.logicalBufferReferenceValue = logicalBufferReferenceValue;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }

    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        if (logicalBuffer.storedData[this.logicalBufferReturnKey] == null) {
            logicalBuffer.storedData[this.logicalBufferReturnKey] = [];
        }

        var _ = new LogicalUtils();
        var resolvedValue = _.ResolveVariable(this.logicalBufferReferenceValue, logicalBuffer);

        if (this.option == ArrayStepOptions.ADD) {
            logicalBuffer.storedData[this.logicalBufferReturnKey].push(resolvedValue);
        }

        return true;
    }


    getStepId(): StepId {
        return StepId.ARRAY;
    }
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.option = dto.args["option"];
        this.logicalBufferReferenceValue = LogicalVariable.generateFromDTO(dto.args["logicalBufferReferenceValue"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
    }
    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["option"] = this.option;
        dto.args["logicalBufferReferenceValue"] = this.logicalBufferReferenceValue.convertToDTO();
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

RegisterEventBufferStep(ArrayStep);