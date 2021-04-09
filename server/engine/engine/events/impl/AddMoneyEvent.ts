///<reference path="../GameEvent.ts" />
///<reference path="../EventArgs.ts" />

class AddMoneyEvent extends GameEvent {

    static PLAYER_UUID: string = "PLAYER_UUID";
    static AMOUNT: string = "AMOUNT";

    playerToAddMoneyToUUID: string;
    amount: number;

    populateFromArgs(args: {}): void {
        this.playerToAddMoneyToUUID = args[AddMoneyEvent.PLAYER_UUID];
        this.amount = args[AddMoneyEvent.AMOUNT];

    }

    getId(): number {
        return EventIds.ADD_MONEY;
    }

    execute(gameDTO: GameDTO): void {
        var player = GameDTOAccess.getPlayerFromUUID(gameDTO, this.playerToAddMoneyToUUID);
        player.turn.money += this.amount;
        var lu = new LoggingUtils(gameDTO);
        if (this.amount >= 0) {
            Log.send(lu.fname(this.playerToAddMoneyToUUID) + " +" + this.amount + "  money.");
        }
        else{
            Log.send(lu.fname(this.playerToAddMoneyToUUID) + " " + this.amount + "  money.");
        }
    }

}

class AddMoneyEventArgs extends EventArgs {

    constructor(playerUUID: LogicalVariable, amount: LogicalVariable) {
        super();
        this.add(AddMoneyEvent.PLAYER_UUID, playerUUID).add(AddMoneyEvent.AMOUNT, amount);
    }
}

RegisterEvent(AddMoneyEvent);