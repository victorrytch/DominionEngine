abstract class GameEvent {

    status: EventStatus = EventStatus.DECLARED;
    reactionsPolled: boolean = false;
    eventSource: EventSourceType;
    eventSourceUUID: string;
    uuid: string;
    args: {};

    static EVENT_DEFINITION = {};

    constructor(eventSource: EventSourceType, eventSourceUUID: string, args: {}) {
        if (args != null) {
            this.eventSource = eventSource;
            this.eventSourceUUID = eventSourceUUID;
            this.uuid = UUID();
            this.args = args;
            this.populateFromArgs(args);
        }
    }

    static create(eventId: EventIds, args: {}): GameEvent {
        return GameEvent.EVENT_DEFINITION[eventId](args);
    }

    static createWithStatus(eventId: EventIds, status: EventStatus, args: {}): GameEvent {
        var event = GameEvent.EVENT_DEFINITION[eventId](args);
        event.status = status;
        return event;
    }

    static createFromDTO(dto: GameDTO_EventEntry): GameEvent {
        var event: GameEvent = GameEvent.EVENT_DEFINITION[dto.eventId](dto.args);
        event.populateFromArgs(dto.args);
        event.status = dto.status;
        event.reactionsPolled = dto.reactionsPolled;
        event.uuid = dto.eventUUID;
        event.eventSourceUUID = dto.sourceUUID;
        return event;
    }

    convertToDTO(): GameDTO_EventEntry {
        var eventEntry = new GameDTO_EventEntry();
        eventEntry.sourceType = this.eventSource;
        eventEntry.eventId = this.getId();
        eventEntry.sourceUUID = this.eventSourceUUID;
        eventEntry.args = this.args;
        eventEntry.reactionsPolled = this.reactionsPolled;
        eventEntry.status = this.status;
        return eventEntry;
    }

    abstract populateFromArgs(args: {}): void;
    abstract getId(): number;
    abstract execute(gameDTO: GameDTO): void;

    static registerCardGenerator(id: number, generator: (args: {}) => GameEvent) {
        GameEvent.EVENT_DEFINITION[id] = generator;
    }

    configureGenerator() {
        var _this = this;
        GameEvent.registerCardGenerator(this.getId(), (args) => {
            var instance = new (<any> _this).constructor(null, null, args);
            return instance;
        });
    }

}


function RegisterEvent(gameEventType: any) {
    new gameEventType().configureGenerator();
}