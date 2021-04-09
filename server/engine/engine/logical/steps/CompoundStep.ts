abstract class CompoundStep extends LogicalStep {
    currentSubstepIndex: number = 0;
    substeps: LogicalStep[] = [];

    constructor(substeps: LogicalStep[]) {
        super();
        this.substeps = substeps;
    }

    hasSubsteps(): boolean {
        return true;
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return this.substeps[this.currentSubstepIndex];
    }

    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        var _ = new LogicalUtils();
        var currentStep = this.substeps[this.currentSubstepIndex];

        var isSubStepComplete = currentStep.processAndAdvance(logicalBuffer, gameDTO);

        if (isSubStepComplete) {
            this.currentSubstepIndex++;
        }

        if (this.currentSubstepIndex >= this.substeps.length) {
            return true;
        }

        return false;
    }

    reset(): void {
        this.currentSubstepIndex = 0;
        this.substeps.forEach((eachStep) => {
            eachStep.reset();
        });
    }

    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
        this.substeps = [];
        for (var key in dto.args["substeps"]) {
            this.substeps[key] = LogicalStep.createFromDTO(dto.args["substeps"][key], logicalBuffer, gameDTO);
        }
    }

    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var _ = new LogicalUtils();
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["currentSubstepIndex"] = this.currentSubstepIndex;
        dto.args["substeps"] = _.SerializeDTOArray(this.substeps);
        return dto;
    }


}
