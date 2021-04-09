///<reference path="../GameEvent.ts" />
///<reference path="../EventArgs.ts" />

class AddActionEvent extends GameEvent {

    static PLAYER_UUID: string = "PLAYER_UUID";
    static AMOUNT: string = "AMOUNT";

    playerToAddActionToUUID: string;
    amount: number;

    populateFromArgs(args: {}): void {
        this.playerToAddActionToUUID = args[AddActionEvent.PLAYER_UUID];
        this.amount = args[AddActionEvent.AMOUNT];
    }

    getId(): number {
        return EventIds.ADD_ACTION;
    }

    execute(gameDTO: GameDTO): void {
        var player = GameDTOAccess.getPlayerFromUUID(gameDTO, this.playerToAddActionToUUID);
        player.turn.actions += this.amount;
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.fname(this.playerToAddActionToUUID) + " received +" + this.amount + " Action(s).")
    }
}

class AddActionEventArgs extends EventArgs {

    constructor(playerUUID: LogicalVariable, amount: LogicalVariable) {
        super();
        this.add(AddActionEvent.PLAYER_UUID, playerUUID).add(AddActionEvent.AMOUNT, amount);
    }
}

RegisterEvent(AddActionEvent);