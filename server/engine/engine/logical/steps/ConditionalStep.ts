///<reference path="../LogicalStep.ts" />


class ConditionalStep extends LogicalStep {
    conditionalBufferVariable: LogicalVariable;
    valueMap: {} = {};
    currentSubstepIndex: number = 0;

    constructor(conditionalBufferVariable: LogicalVariable, valueMap: {}) {
        super();
        this.conditionalBufferVariable = conditionalBufferVariable;
        this.valueMap = valueMap;
    }

    hasSubsteps(): boolean {
        return true;
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        var _ = new LogicalUtils();
        var conditionalBufferValue = _.ResolveVariable(this.conditionalBufferVariable, logicalBuffer);
        var chosenPath: LogicalStep[] = this.valueMap[conditionalBufferValue];
        var currentStep = chosenPath[this.currentSubstepIndex];
        return currentStep
    }



    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        var _ = new LogicalUtils();
        var conditionalBufferValue = _.ResolveVariable(this.conditionalBufferVariable, logicalBuffer);
        var chosenPath: LogicalStep[] = this.valueMap[conditionalBufferValue];
        if (chosenPath != null) {
            var currentStep = chosenPath[this.currentSubstepIndex];

            var isSubStepComplete = currentStep.processAndAdvance(logicalBuffer, gameDTO);

            if (isSubStepComplete) {
                this.currentSubstepIndex++;
            }

            if (this.currentSubstepIndex >= chosenPath.length) {
                return true;
            }

            return false;
        }
        return true;
    }

    reset(): void {
        this.currentSubstepIndex = 0;
        for (var key in this.valueMap) {
            var chosenPath: LogicalStep[] = this.valueMap[key];
            chosenPath.forEach((eachStep) => {
                eachStep.reset();
            });
        }
    }

    getStepId(): StepId {
        return StepId.CONDITIONAL;
    }

    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.conditionalBufferVariable = LogicalVariable.generateFromDTO(dto.args["conditionalBufferVariable"]);
        this.valueMap = {};
        for (var key in dto.args["valueMap"]) {
            this.valueMap[key] = []; 
            dto.args["valueMap"][key].forEach((eachValue) => {
                this.valueMap[key].push(LogicalStep.createFromDTO(eachValue, logicalBuffer, gameDTO));
            });
        }
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
    }

    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var _ = new LogicalUtils();
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["conditionalBufferVariable"] = this.conditionalBufferVariable.convertToDTO();
        dto.args["valueMap"] = _.SerializeString2DTOMap(this.valueMap);
        dto.args["currentSubstepIndex"] = this.currentSubstepIndex;
        return dto;
    }
   
}

RegisterEventBufferStep(ConditionalStep);