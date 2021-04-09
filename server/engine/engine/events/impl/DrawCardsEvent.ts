///<reference path="../GameEvent.ts" />

class DrawCardsEvent extends GameEvent {

    static RECIPIENT: string = "RECIPIENT";

    recipient: string;
    amount: number = 1

    populateFromArgs(args: {}): void {
        this.recipient = args[DrawCardsEvent.RECIPIENT];
    }

    getId(): number {
        return EventIds.DRAW_CARD;
    }

    execute(gameDTO: GameDTO): void {
        var lu = new LoggingUtils(gameDTO);
        var deck = GameDTOAccess.getCardDTOsInZone(gameDTO, this.recipient, Zones.DECK);
        var cardUUID = GameDTOAccess.getTopCardOfDeck(gameDTO, this.recipient);
        GameDTOAccess.setZone(gameDTO, cardUUID, Zones.HAND);
        Log.send(lu.owner(cardUUID) + " draws " + lu.fname(cardUUID));
    }


}

class DrawCardsEventArgs extends EventArgs {

    constructor(recipient: LogicalVariable) {
        super();
        this.add(DrawCardsEvent.RECIPIENT, recipient);
    }

}

RegisterEvent(DrawCardsEvent);