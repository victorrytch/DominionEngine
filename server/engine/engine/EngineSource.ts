class EngineSource {
    type: EngineSourceType;
    uuid: string;
}

enum EngineSourceType {
    LOGICAL,
    REACTION,
    EVENT,
    USER
}