///<reference path="../LogicalStep.ts" />

class EventGeneratorStep extends LogicalStep {
    eventId: EventIds;
    eventGeneratorArgs: EventArgs;

    constructor(eventId, eventGeneratorArgs) {
        super();
        this.eventId = eventId;
        this.eventGeneratorArgs = eventGeneratorArgs;
    }

    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        var _ = new LogicalUtils();
        var calculatedArgs = {};
        for (var key in this.eventGeneratorArgs.data) {
            if (this.eventGeneratorArgs.data[key] != null) {
                calculatedArgs[key] = _.ResolveVariable(LogicalVariable.generateFromDTO(this.eventGeneratorArgs.data[key]), logicalBuffer);
            }
            //Log.send("key: " + key + " value: " + calculatedArgs[key] + " logicbuffer: " + logicalBuffer.storedData[key]);
        }
        var event: GameEvent = GameEvent.create(this.eventId, calculatedArgs);
        GameDTOAccess.pushEventToStack(gameDTO, event);
        LogicalStack.currentOutput.eventsGenerated = true;
        gameDTO.state.state = GameState.RESOLVING_EVENT_STACK;
        return true;
    }

    getStepId(): StepId {
        return StepId.EVENT_GENERATOR;
    }

    reset(): void {

    }

    hasSubsteps(): boolean {
        return false;
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return this;
    }

    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        this.eventId = dto.args["eventId"];
        this.eventGeneratorArgs = new EventArgs();
        this.eventGeneratorArgs.data = dto.args["eventGeneratorArgs"];
    }

    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["eventId"] = this.eventId;
        dto.args["eventGeneratorArgs"] = this.eventGeneratorArgs.data;
        return dto;
    }


}

RegisterEventBufferStep(EventGeneratorStep);