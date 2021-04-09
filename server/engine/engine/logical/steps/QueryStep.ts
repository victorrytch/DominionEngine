///<reference path="../LogicalStep.ts" />

enum QueryStepOptions {
    NOT_IN,
    IN
}

class QueryStep extends LogicalStep {
    setOne: LogicalVariable;
    option: QueryStepOptions;
    setTwo: LogicalVariable;
    logicalBufferReturnKey: string;

    constructor(setOne: LogicalVariable, option: QueryStepOptions, setTwo: LogicalVariable, logicalBufferReturnKey: string) {
        super();
        this.setOne = setOne;
        this.setTwo = setTwo;
        this.option = option;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }

    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        var _ = new LogicalUtils();
        var firstOpValue = _.ResolveVariable(this.setOne, logicalBuffer);
        var secondOpValue = _.ResolveVariable(this.setTwo, logicalBuffer);

        firstOpValue = Util.convertToArray(firstOpValue);
        secondOpValue = Util.convertToArray(secondOpValue);

        var queryEval = [];

        if (this.option == QueryStepOptions.NOT_IN) {
            secondOpValue.forEach((innerEach) => {
                if (firstOpValue.indexOf(innerEach) == -1) {
                    queryEval.push(innerEach);
                }
            })
        }
        else if (this.option == QueryStepOptions.IN) {
            secondOpValue.forEach((innerEach) => {
                if (firstOpValue.indexOf(innerEach) != -1) {
                    queryEval.push(innerEach);
                }
            })
        }

        logicalBuffer.storedData[this.logicalBufferReturnKey] = queryEval;

        return true;
    }

    reset(): void {

    }


    getStepId(): StepId {
        return StepId.QUERY;
    }

    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.setOne = LogicalVariable.generateFromDTO(dto.args["setOne"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
        this.setTwo = LogicalVariable.generateFromDTO(dto.args["setTwo"]);
        this.option = dto.args["option"];
    }

    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var dto: GameDTO_LogicalBuffer_Step = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["setOne"] = this.setOne;
        dto.args["option"] = this.option;
        dto.args["setTwo"] = this.setTwo;
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        return dto;
    }


    hasSubsteps(): boolean {
        return false;
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return null;
    }


}

RegisterEventBufferStep(QueryStep);

