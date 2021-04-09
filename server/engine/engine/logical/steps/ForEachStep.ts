class ForEachStep extends LogicalStep {
    currentSubstepIndex: number;
    stepsToLoop: LogicalStep[];
    listVariable: LogicalVariable;
    eachReferenceTag: string;
    currentListIndex: number;

    constructor(listVariable: LogicalVariable, eachReferenceTag: string, stepsToLoop: LogicalStep[]) {
        super();
        this.listVariable = listVariable;
        this.eachReferenceTag = eachReferenceTag;
        this.stepsToLoop = stepsToLoop;
        this.currentSubstepIndex = 0;
        this.currentListIndex = 0;
    }

    reset(): void {
        this.currentSubstepIndex = 0;
        this.currentListIndex = 0;
        this.stepsToLoop.forEach((eachStep) => {
            eachStep.reset();
        });
    }

    hasSubsteps(): boolean {
        return true;
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return this.stepsToLoop[this.currentSubstepIndex];
    }

    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        var _ = new LogicalUtils();
        var listVariableParsed = _.ResolveVariable(this.listVariable, logicalBuffer);
        listVariableParsed = Util.convertToArray(listVariableParsed);
        //Log.send("For each will iterate " + listVariableParsed.length + " times. This is iteration " + this.currentListIndex);
        //listVariableParsed = JSON.parse(listVariableParsed);
        //Log.send("listVariableParsed: " + listVariableParsed + " length: " + listVariableParsed.length);
        if (listVariableParsed.length > 0) {
            var currentStep = this.stepsToLoop[this.currentSubstepIndex];
            logicalBuffer.storedData[this.eachReferenceTag] = listVariableParsed[this.currentListIndex];

            var isSubStepComplete = currentStep.processAndAdvance(logicalBuffer, gameDTO);

            if (isSubStepComplete) {
                this.currentSubstepIndex++;
            }

            if (this.currentSubstepIndex >= this.stepsToLoop.length) {
                this.currentListIndex++;
                if (this.currentListIndex >= listVariableParsed.length) {
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
        else {
            return true;
        }
    }

    getStepId(): StepId {
        return StepId.FOR_EACH;
    }
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
        this.stepsToLoop = [];
        for (var key in dto.args["stepsToLoop"]) {
            this.stepsToLoop[key] = LogicalStep.createFromDTO(dto.args["stepsToLoop"][key], logicalBuffer, gameDTO);
        }
        this.listVariable = LogicalVariable.generateFromDTO(dto.args["listVariable"]);
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
        this.eachReferenceTag = dto.args["eachReferenceTag"];
        this.currentListIndex = dto.args["currentListIndex"];
        
    }
    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var _ = new LogicalUtils();
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["currentSubstepIndex"] = this.currentSubstepIndex;
        dto.args["stepsToLoop"] = _.SerializeDTOArray(this.stepsToLoop);
        dto.args["listVariable"] = this.listVariable;
        dto.args["eachReferenceTag"] = this.eachReferenceTag;
        dto.args["currentListIndex"] = this.currentListIndex;

        return dto;
    }


}

RegisterEventBufferStep(ForEachStep);