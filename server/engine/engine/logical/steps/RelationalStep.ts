///<reference path="../LogicalStep.ts" />

enum RelationalOptions {
    GREATER_THAN_EQ,
    LESS_THAN,
    EQUALS,
    GREATER_THAN,
    NOT_EQ
}


class RelationalStep extends LogicalStep {
    firstOperand: LogicalVariable;
    relationalOption: RelationalOptions;
    secondOperand: LogicalVariable;
    stepsToPerform: LogicalStep[];

    hasBeenReset: boolean;
    currentSubstepIndex: number;

    constructor(firstOperand: LogicalVariable, relationalOption: RelationalOptions, secondOperand: LogicalVariable, stepsToPerform: LogicalStep[]) {
        super();
        this.firstOperand = firstOperand;
        this.relationalOption = relationalOption;
        this.secondOperand = secondOperand;
        this.stepsToPerform = stepsToPerform;
        this.currentSubstepIndex = 0;
    }

    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        //alert("inside relational step");
        this.hasBeenReset = false;

        var _ = new LogicalUtils();
        var firstOpValue = _.ResolveVariable(this.firstOperand, logicalBuffer);
        var secondOpValue = _.ResolveVariable(this.secondOperand, logicalBuffer);

        var relationalEval = null;

        if (this.relationalOption == RelationalOptions.GREATER_THAN_EQ) {
            relationalEval = firstOpValue >= secondOpValue;
        }
        else if (this.relationalOption == RelationalOptions.LESS_THAN) {
            relationalEval = firstOpValue < secondOpValue;
        }
        else if (this.relationalOption == RelationalOptions.EQUALS) {
            relationalEval = firstOpValue == secondOpValue;
        }
        else if (this.relationalOption == RelationalOptions.NOT_EQ) {
            relationalEval = firstOpValue != secondOpValue;
        }
        else if (this.relationalOption == RelationalOptions.GREATER_THAN) {
            relationalEval = firstOpValue > secondOpValue;
        }

        if (relationalEval) {
            var currentStep = this.stepsToPerform[this.currentSubstepIndex];

            var isSubStepComplete = currentStep.processAndAdvance(logicalBuffer, gameDTO);

            if (this.hasBeenReset) {
                this.hasBeenReset = false;
            }
            else {
                if (isSubStepComplete) {
                    this.currentSubstepIndex++;
                }

                if (this.currentSubstepIndex >= this.stepsToPerform.length) {
                    return true;
                }
            }
            
            return false;
        }

        return true;
    }
    getStepId(): StepId {
        return StepId.RELATIONAL;
    }

    reset(): void {
        this.hasBeenReset = true;
        this.currentSubstepIndex = 0;
        this.stepsToPerform.forEach((eachStep) => {
            eachStep.reset();
        });
    }


    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.firstOperand = LogicalVariable.generateFromDTO(dto.args["firstOperand"]);
        this.secondOperand = LogicalVariable.generateFromDTO(dto.args["secondOperand"]);
        this.relationalOption = dto.args["relationalOption"];
        this.stepsToPerform = [];
        for (var key in dto.args["stepsToPerform"]) {
            this.stepsToPerform[key] = LogicalStep.createFromDTO(dto.args["stepsToPerform"][key], logicalBuffer, gameDTO);
        }
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
        this.hasBeenReset = dto.args["hasBeenReset"];
    }
    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var _ = new LogicalUtils();
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["firstOperand"] = this.firstOperand;
        dto.args["relationalOption"] = this.relationalOption;
        dto.args["secondOperand"] = this.secondOperand;
        dto.args["stepsToPerform"] = _.SerializeDTOArray(this.stepsToPerform);
        dto.args["currentSubstepIndex"] = this.currentSubstepIndex;
        dto.args["hasBeenReset"] = this.hasBeenReset;
        return dto;
    }


    hasSubsteps(): boolean {
        return true;
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return this.stepsToPerform[this.currentSubstepIndex];
    }


}


RegisterEventBufferStep(RelationalStep);