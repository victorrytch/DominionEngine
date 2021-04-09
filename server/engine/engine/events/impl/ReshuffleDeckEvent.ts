///<reference path="../GameEvent.ts" />

class ReshuffleDeckEvent extends GameEvent {

    static WHOSE_DECK: string = "WHOSE_DECK";

    recipient: string;

    populateFromArgs(args: {}): void {
        this.recipient = args[ReshuffleDeckEvent.WHOSE_DECK];
    }

    getId(): number {
        return EventIds.RESHUFFLE_DECK;
    }

    execute(gameDTO: GameDTO): void {
        var lu = new LoggingUtils(gameDTO);
        GameDTOAccess.getCardsInZone(gameDTO, this.recipient, Zones.DISCARD_PILE).forEach((eachUUID) => {
            GameDTOAccess.setZone(gameDTO, eachUUID, Zones.DECK);
        })
        GameDTOAccess.shuffleDeck(gameDTO, this.recipient);

        Log.send(lu.fname(this.recipient) + " reshuffles.");
    }


}

class ReshuffleDeckEventArgs extends EventArgs {

    constructor(whose: LogicalVariable) {
        super();
        this.add(ReshuffleDeckEvent.WHOSE_DECK, whose);
    }

}

RegisterEvent(ReshuffleDeckEvent);