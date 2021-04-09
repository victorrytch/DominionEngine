class LogicalBuffer {
    uuid: string;
    currentStepUUID: string;
    steps: LogicalStep[] = [];
    storedData: {} = {};
    isComplete: boolean = false;

    addStep(step: LogicalStep) {
        this.steps.push(step);
    }

    addSteps(...steps: LogicalStep[]) {
        var __this = this;
        steps.forEach((value) => {
            __this.steps.push(value);
        })

    }

    addAllSteps(steps: LogicalStep[]) {
        var __this = this;
        steps.forEach((value) => {
            __this.steps.push(value);
        })

    }
    
    processAndAdvance(gameDTO: GameDTO): boolean {
        if (this.currentStepUUID == null) {
            this.currentStepUUID = this.steps[0].uuid;
        }
        var currentStep = this.getCurrentStep();

        //Log.send("Executing step: " + StepId[currentStep.getStepId()])
        var isComplete = currentStep.processAndAdvance(this, gameDTO);
        if (isComplete) {
            if (this.currentStepUUID == currentStep.uuid) {
                var indexOf = this.steps.indexOf(currentStep);
                if ((indexOf >= (this.steps.length - 1))) {
                    this.currentStepUUID = null;
                    this.isComplete = true;
                }
                else {
                    this.currentStepUUID = this.steps[indexOf + 1].uuid;
                }
            }

        }
        GameDTOAccess.updateLogicalBuffer(gameDTO, this);

        return this.isComplete;
    }

    getCurrentStep(): LogicalStep {
        var result = null;
        var __this = this;

        if (this.currentStepUUID == null) {
            this.currentStepUUID = this.steps[0].uuid;
        }

        this.steps.forEach((value) => {
            if (value.uuid == __this.currentStepUUID) {
                result = value;
            }
        });

        return result;
    } 

    static createFromDTO(dto: GameDTO_LogicalBuffer, gameDTO: GameDTO): LogicalBuffer {
        var obj = new LogicalBuffer();
        obj.uuid = dto.uuid;
        obj.currentStepUUID = dto.currentStep;
        obj.steps = [];
        obj.storedData = dto.storedData;
        dto.steps.forEach((each) => {
            obj.steps.push(LogicalStep.create(each.stepId, each, obj, gameDTO));
        });
        return obj;
    }

    convertToDTO(gameDTO: GameDTO): GameDTO_LogicalBuffer {
        var __this = this;
        var dto = new GameDTO_LogicalBuffer();
        dto.uuid = this.uuid;
        dto.currentStep = this.currentStepUUID;
        dto.steps = [];
        dto.storedData = this.storedData;
        this.steps.forEach((each) => {
            dto.steps.push(each.convertToDTO())
        });
        return dto;
    }

    reset() {
        this.steps.forEach((eachStep) => {
            eachStep.reset();
        });
        this.storedData = {};
    }

}