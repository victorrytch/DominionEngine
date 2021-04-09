///<reference path="../GameEvent.ts" />

class SetUnaffectedEvent extends GameEvent {

    static PROTECTED_PLAYER: string = "PROTECTED_PLAYER";
    static PROTECTED_FROM: string = "PROTECTED_FROM";
    static ACTION: string = "ACTION";

    recipient: string;
    action: SetUnaffectedEventAction;
    cardProtectedFrom: number;

    populateFromArgs(args: {}): void {
        this.recipient = args[SetUnaffectedEvent.PROTECTED_PLAYER];
        this.cardProtectedFrom = args[SetUnaffectedEvent.PROTECTED_FROM];
        this.action = args[SetUnaffectedEvent.ACTION];
    }

    getId(): number {
        return EventIds.SET_UNAFFECTED;
    }

    execute(gameDTO: GameDTO): void {
        if (this.action == SetUnaffectedEventAction.SET) {
            GameDTOAccess.setPlayerUnaffectedByEffect(gameDTO, this.recipient, this.cardProtectedFrom);
        }
        else if (this.action == SetUnaffectedEventAction.REMOVE) {
            GameDTOAccess.removePlayerUnaffectedByEffect(gameDTO, this.recipient, this.cardProtectedFrom);
        }
    }


}

class SetUnaffectedEventArgs extends EventArgs {

    constructor(protectedPlayer: LogicalVariable, protectedFrom: LogicalVariable, action: LogicalVariable) {
        super();
        this.add(SetUnaffectedEvent.PROTECTED_PLAYER, protectedPlayer).add(SetUnaffectedEvent.PROTECTED_FROM, protectedFrom).add(SetUnaffectedEvent.ACTION, action);
    }

}

enum SetUnaffectedEventAction {
    SET,
    REMOVE
}

RegisterEvent(SetUnaffectedEvent);