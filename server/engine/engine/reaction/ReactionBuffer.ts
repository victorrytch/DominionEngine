class ReactionBuffer implements DTOCompatible<GameDTO_ReactionBuffer>{

    eventUUID: string;
    eventStatus: EventStatus;
    entries: ReactionKey[];

    constructor(eventUUID: string, eventStatus: EventStatus, entries: ReactionKey[]) {
        this.eventUUID = eventUUID;
        this.eventStatus = eventStatus;
        this.entries = entries;
    }

    processAndAdvance(gameDTO: GameDTO): boolean {
        var topReaction = this.entries[this.entries.length - 1];
        var event = GameDTOAccess.getEvent(gameDTO, this.eventUUID);
        ReactionBuffer.GetReactiveComponent(gameDTO, topReaction).getReactions().forEach((eachReaction) => {
            if (eachReaction.canActivate(event, gameDTO)) {
                eachReaction.effectLogic(event, gameDTO);
            }
        });
            
        this.entries.pop();

        if (this.entries.length <= 0) {
            return true;
        }

        return false;
    }

    convertToDTO(): GameDTO_ReactionBuffer {
        var dto = new GameDTO_ReactionBuffer();
        dto.eventUUIDReactingTo = this.eventUUID;
        dto.eventStatus = this.eventStatus;
        dto.potentialReactions = this.entries;
        return dto;
    }

    static REACTIVES_COMPONENTS = {};

    static RegisterReactiveComponent = (key: ReactionKey, component: (gameDTO: GameDTO, uuid: string) => Reactive) => {
        var strKey = JSON.stringify(key);
        ReactionBuffer.REACTIVES_COMPONENTS[strKey] = (gameDTO: GameDTO) => {
            return component(gameDTO, key.id);
        }
    }

    static GetReactiveComponent = (gameDTO: GameDTO, key: ReactionKey): Reactive => {
        var cardDTO = GameDTOAccess.getCardDTO(gameDTO, key.id);
        return ReactionBuffer.REACTIVES_COMPONENTS[JSON.stringify(key)](gameDTO);
    }

    static pollReactions(event: GameEvent, gameDTO: GameDTO): ReactionKey[] {
        var result: ReactionKey[] = [];
        for (var key in ReactionBuffer.REACTIVES_COMPONENTS) {
            var reactionEntry: Reaction[] = ReactionBuffer.REACTIVES_COMPONENTS[key](gameDTO).getReactions();
            reactionEntry.forEach((eachReaction) => {
                if (eachReaction.validStatusCheck == event.status) {
                    var dto = GameDTOAccess.getCardDTO(gameDTO, ReactionKey.fromString(key).id);
                    if (eachReaction.canActivate(event, gameDTO)) {
                        var dto = GameDTOAccess.getCardDTO(gameDTO, ReactionKey.fromString(key).id);
                        result.push(ReactionKey.fromString(key));
                    }
                }
            })
        }
        return result;
    }

}


class ReactionKey {
    type: ReactionSourceType;
    id: string;

    constructor(type: ReactionSourceType, id: string) {
        this.type = type;
        this.id = id;
    }

    static fromString(str: string) {
        var obj = JSON.parse(str);
        var newKey = new ReactionKey(obj["type"], obj["id"]);
        return newKey;
    }
}

enum ReactionSourceType {
    CARD,
    SYSTEM
}





