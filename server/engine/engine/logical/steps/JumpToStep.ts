///<reference path="../LogicalStep.ts" />

class JumpToStep extends LogicalStep {

    stepUUID: LogicalVariable;

    constructor(stepUUID: LogicalVariable) {
        super();
        this.stepUUID = stepUUID;
    }


    reset(): void {

    }

    hasSubsteps(): boolean {
        return false;
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return this;
    }

    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        var _ = new LogicalUtils();

        logicalBuffer.reset();
        logicalBuffer.currentStepUUID = _.ResolveVariable(this.stepUUID, logicalBuffer);

        return true;
    }

    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.stepUUID = LogicalVariable.generateFromDTO(dto.args["stepUUID"]);
    }

    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["stepUUID"] = this.stepUUID.convertToDTO();
        return dto;
    }

    getStepId(): StepId {
        return StepId.JUMP_TO_STEP;
    }

}

RegisterEventBufferStep(JumpToStep);