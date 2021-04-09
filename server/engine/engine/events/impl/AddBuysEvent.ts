///<reference path="../GameEvent.ts" />
///<reference path="../EventArgs.ts" />

class AddBuysEvent extends GameEvent {

    static PLAYER_UUID: string = "PLAYER_UUID";
    static AMOUNT: string = "AMOUNT";

    playerToAddMoneyToUUID: string;
    amount: number;

    populateFromArgs(args: {}): void {
        this.playerToAddMoneyToUUID = args[AddBuysEvent.PLAYER_UUID];
        this.amount = args[AddBuysEvent.AMOUNT];
    }

    getId(): number {
        return EventIds.ADD_BUYS;
    }

    execute(gameDTO: GameDTO): void {
        var player = GameDTOAccess.getPlayerFromUUID(gameDTO, this.playerToAddMoneyToUUID);
        player.turn.buys += this.amount;
    }

}

class AddBuysEventArgs extends EventArgs {

    constructor(playerUUID: LogicalVariable, amount: LogicalVariable) {
        super();
        this.add(AddBuysEvent.PLAYER_UUID, playerUUID).add(AddBuysEvent.AMOUNT, amount);
    }
}

RegisterEvent(AddBuysEvent);