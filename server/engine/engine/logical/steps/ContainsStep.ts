///<reference path="../LogicalStep.ts" />


class ContainsStep extends LogicalStep {
    valueToCheckFor: LogicalVariable;
    setToCheckIn: LogicalVariable;
    stepsToPerform: LogicalStep[];
    currentSubstepIndex: number = 0;
    doesntContain: boolean;

    static DOES_NOT_CONTAIN: boolean = true;

    constructor(valueToCheckFor: LogicalVariable, setToCheckIn: LogicalVariable, stepsToPerform: LogicalStep[], doesntContain?: boolean) {
        super();
        this.valueToCheckFor = valueToCheckFor;
        this.setToCheckIn = setToCheckIn;
        this.stepsToPerform = stepsToPerform;
        if (doesntContain != null) {
            this.doesntContain = doesntContain;
        }
        else {
            this.doesntContain = false;
        }

    }

    hasSubsteps(): boolean {
        return true;
    }

    reset(): void {
        this.currentSubstepIndex = 0;
        this.stepsToPerform.forEach((eachStep) => {
            eachStep.reset();
        });
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return this.stepsToPerform[this.currentSubstepIndex];
    }

    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        var _ = new LogicalUtils();
        var resolvedValue = _.ResolveVariable(this.valueToCheckFor, logicalBuffer);
        var resolvedSetValue = _.ResolveVariable(this.setToCheckIn, logicalBuffer);

        var fitsRequirement = null;

        if (this.doesntContain) {
            fitsRequirement = resolvedSetValue.indexOf(resolvedValue) == -1;
        }
        else {
            fitsRequirement = resolvedSetValue.indexOf(resolvedValue) != -1;
        }

        if (fitsRequirement) {
            var currentStep = this.stepsToPerform[this.currentSubstepIndex];
            var isSubStepComplete = currentStep.processAndAdvance(logicalBuffer, gameDTO);

            if (isSubStepComplete) {
                this.currentSubstepIndex++;
            }

            if (this.currentSubstepIndex >= this.stepsToPerform.length) {
                return true;
            }

            return false;
        }

        return true;
    }

    getStepId(): StepId {
        return StepId.CONTAINS;
    }

    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.valueToCheckFor = LogicalVariable.generateFromDTO(dto.args["valueToCheckFor"]);
        this.setToCheckIn = LogicalVariable.generateFromDTO(dto.args["setToCheckIn"]);
        this.stepsToPerform = [];
        for (var key in dto.args["stepsToPerform"]) {
            this.stepsToPerform[key] = LogicalStep.createFromDTO(dto.args["stepsToPerform"][key], logicalBuffer, gameDTO);
        }
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
        this.doesntContain = dto.args["doesntContain"];
    }

    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var _ = new LogicalUtils();
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["valueToCheckFor"] = this.valueToCheckFor.convertToDTO();
        dto.args["setToCheckIn"] = this.setToCheckIn.convertToDTO();
        dto.args["stepsToPerform"] = _.SerializeDTOArray(this.stepsToPerform);
        dto.args["currentSubstepIndex"] = this.currentSubstepIndex;
        dto.args["doesntContain"] = this.doesntContain;
        return dto;
    }

}

RegisterEventBufferStep(ContainsStep);