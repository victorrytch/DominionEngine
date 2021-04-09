///<reference path="./DTO.ts" />

class GameDTO extends DTO{

    players: GameDTO_Player[] = [];
    cards: GameDTO_Card[] = [];
    engine: GameDTO_Engine = new GameDTO_Engine();
    state: GameDTO_State = new GameDTO_State();
}

class GameDTO_Engine extends DTO {
    logicalStack: GameDTO_LogicalBuffer[] = [];
    reactionStack: GameDTO_ReactionBuffer[] = [];
    eventStack: GameDTO_EventEntry[] = [];
}

class GameDTO_Player extends DTO{
    uuid: string;
    name: string;
    turn: GameDTO_Player_Turn = new GameDTO_Player_Turn();
}

class GameDTO_Player_Turn extends DTO{
    money: number = 0;
    actions: number = 0;
    buys: number = 0;
}

class GameDTO_Card extends DTO{
    uuid: string;
    definitionId: number;
    zoneId: number;
    ownerUUID: string;
    zoneIndex: number;
}

class GameDTO_LogicalBuffer extends DTO{
    uuid: string;
    currentStep: string;
    steps: GameDTO_LogicalBuffer_Step[];
    storedData: {} = {};
}

class GameDTO_LogicalBuffer_Step extends DTO{
    uuid: string;
    stepId: number;
    args: {};
}

class GameDTO_LogicalBufferVariable extends DTO{
    type: number;
    value: string;
}


class GameDTO_EventEntry extends DTO{
    eventUUID: string;
    eventId: number;
    sourceType: number;
    sourceUUID: string;
    reactionsPolled: boolean;
    status: number;
    args: {};
}

class GameDTO_State extends DTO{
    state: GameState = GameState.START;
    turnPlayer: string;
    phase: Phase = Phase.ACTION;
    unaffectedPlayers: any[] = [];
}

class GameDTO_ReactionBuffer extends DTO {
    potentialReactions: ReactionKey[] = [];
    eventUUIDReactingTo: string;
    eventStatus: number;
}