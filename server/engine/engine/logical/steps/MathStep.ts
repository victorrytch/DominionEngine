enum MathStepOptions {
    MIN
}


class MathStep extends LogicalStep {
    logicalBufferReferenceArguments: LogicalVariable[];
    option: MathStepOptions;

    logicalBufferReturnKey: string;

    constructor(logicalBufferReferenceArguments: LogicalVariable[], option: MathStepOptions, logicalBufferReturnKey: string) {
        super();
        this.option = option;
        this.logicalBufferReferenceArguments = logicalBufferReferenceArguments;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }

    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        var _ = new LogicalUtils();

        var result = null;

        if (this.option == MathStepOptions.MIN) {
            var resolvedArgs = [];
            this.logicalBufferReferenceArguments.forEach((eachArg) => {
                resolvedArgs.push(_.ResolveVariable(eachArg, logicalBuffer));
            });
            result = Math.min(...resolvedArgs);
        }

        logicalBuffer.storedData[this.logicalBufferReturnKey] = result;

        return true;
    }


    getStepId(): StepId {
        return StepId.MATH;
    }
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.option = dto.args["option"];
        this.logicalBufferReferenceArguments = [];
        dto.args["logicalBufferReferenceArguments"].forEach((eachArg) => {
            this.logicalBufferReferenceArguments.push(LogicalVariable.generateFromDTO(eachArg));
        })
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
    }
    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["option"] = this.option;
        dto.args["logicalBufferReferenceArguments"] = [];
        this.logicalBufferReferenceArguments.forEach((eachArg) => {
            dto.args["logicalBufferReferenceArguments"].push(eachArg.convertToDTO());
        });
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

RegisterEventBufferStep(MathStep);