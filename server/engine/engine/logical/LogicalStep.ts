abstract class LogicalStep implements DTOCompatible<GameDTO_LogicalBuffer_Step>{

    static STEP_DEFINITION = {};

    uuid: string;

    constructor() {
        this.uuid = UUID();
    }


    abstract processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    abstract getStepId(): StepId;
    abstract constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO);
    abstract convertToDTO(): GameDTO_LogicalBuffer_Step;
    abstract reset(): void;
    abstract hasSubsteps(): boolean;
    abstract getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;


    configureGenerator() {
        var _this = this;
        LogicalStep.registerCardGenerator(this.getStepId(), (dto, logicalBuffer, gameDTO) => {
            var instance = new (<any>_this).constructor();
            instance.constructFromDTO(dto, logicalBuffer, gameDTO)
            return instance;
        });
    }

    static createFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return LogicalStep.create(dto.stepId, dto, logicalBuffer, gameDTO);
    }

    static registerCardGenerator(id: number, generator: (dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) => CardDefinition) {
        LogicalStep.STEP_DEFINITION[id] = generator;
    }

    static create(id: number, dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return LogicalStep.STEP_DEFINITION[id](dto, logicalBuffer, gameDTO);
    }
}

function RegisterEventBufferStep(stepType: any) {
    new stepType().configureGenerator();
}