class LoopStep extends LogicalStep {
    currentLoopIteration: number;
    currentSubstepIndex: number;
    amount: LogicalVariable;
    stepsToLoop: LogicalStep[];

    constructor(amount: LogicalVariable, stepsToLoop: LogicalStep[]) {
        super();
        this.amount = amount;
        this.stepsToLoop = stepsToLoop;
        this.currentLoopIteration = 0;
        this.currentSubstepIndex = 0;
    }


    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        var _ = new LogicalUtils();
        var amountValue = _.ResolveVariable(this.amount, logicalBuffer);
        var currentStep = this.stepsToLoop[this.currentSubstepIndex];

        var isSubStepComplete = currentStep.processAndAdvance(logicalBuffer, gameDTO);

        if (isSubStepComplete) {
            this.currentSubstepIndex++;
        }

        if (this.currentSubstepIndex >= this.stepsToLoop.length) {
            this.currentLoopIteration++;
            if (this.currentLoopIteration >= amountValue) {
                return true;
            }
            else {
                this.currentSubstepIndex = 0;
                this.stepsToLoop.forEach((eachStep) => {
                    eachStep.reset();
                })
                return false;
            }
        }
    }

    reset(): void {
        this.currentSubstepIndex = 0;
        this.currentSubstepIndex = 0;
        this.stepsToLoop.forEach((eachStep) => {
            eachStep.reset();
        });
    }

    getStepId(): StepId {
        return StepId.LOOP;
    }

    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.currentLoopIteration = dto.args["currentLoopIteration"];
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
        this.amount = LogicalVariable.generateFromDTO(dto.args["amount"]);

        this.stepsToLoop = [];
        for (var key in dto.args["stepsToLoop"]) {
            this.stepsToLoop[key] = LogicalStep.createFromDTO(dto.args["stepsToLoop"][key], logicalBuffer, gameDTO);
        }
    }

    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var _ = new LogicalUtils();
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["currentLoopIteration"] = this.currentLoopIteration;
        dto.args["currentSubstepIndex"] = this.currentSubstepIndex;
        dto.args["amount"] = this.amount;
        dto.args["stepsToLoop"] = _.SerializeDTOArray(this.stepsToLoop);
        return dto;
    }

    hasSubsteps(): boolean {
        return true;
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return this.stepsToLoop[this.currentSubstepIndex];
    }


}

RegisterEventBufferStep(LoopStep);