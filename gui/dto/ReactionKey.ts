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