///<reference path="Move.ts" />

class BuyMove extends Move {
    cardToBuy: string;
    playerToGain: string;

    constructor(playerToGain: string, cardToBuy: string) {
        super();
        this.cardToBuy = cardToBuy;
        this.playerToGain = playerToGain;
    }

    execute(gameDTO: GameDTO) {
        var _ = new LogicalUtils();

        var args = {};
        args[GainCardEvent.CHOSEN_CARD] = this.cardToBuy;
        args[GainCardEvent.RECIPIENT] = this.playerToGain;
        var playEvent = GameEvent.create(EventIds.GAIN_CARD, args);
        GameDTOAccess.pushEventToStack(gameDTO, playEvent);

        var buyArgs = {};
        buyArgs[AddBuysEvent.AMOUNT] = -1;
        buyArgs[AddBuysEvent.PLAYER_UUID] = this.playerToGain;
        var buyEvent = GameEvent.create(EventIds.ADD_BUYS, buyArgs);
        GameDTOAccess.pushEventToStack(gameDTO, buyEvent);



        GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
    }

    getMoveType() {
        return MoveType.BUY;
    }

    toString(gameDTO: GameDTO): string {
        var lu = new LoggingUtils(gameDTO);
        return "Buy " + lu.fname(this.cardToBuy);
    }


}

RegisterMove(BuyMove);