/*///<reference path="../GameEvent.ts" />

class GainActionsEvent extends GameEvent {

    static RECIPIENT: string = "RECIPIENT";
    static AMOUNT: string = "AMOUNT";

    playerToAddMoneyToUUID: string;
    amount: number;

    populateFromArgs(args: {}): void {
        this.playerToAddMoneyToUUID = args[GainActionsEvent.RECIPIENT];
        this.amount = args[GainActionsEvent.AMOUNT];
    }

    getId(): number {
        return EventIds.ADD_ACTION;
    }

    execute(gameDTO: GameDTO): void {

    }

}

class GainActionsEventArgs extends EventArgs {

    constructor(recipient: EffectBufferVariable, amount: EffectBufferVariable) {
        super();
        this.add(GainActionsEvent.RECIPIENT, recipient).add(GainActionsEvent.AMOUNT, amount);
    }

}

RegisterEvent(GainActionsEvent);*/