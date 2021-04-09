///<reference path="../GameEvent.ts" />

class RevealCardEvent extends GameEvent {

    static CARD_UUID: string = "CARD_UUID";

    chosenCard: string;

    execute(gameDTO: GameDTO): void {
        var lu = new LoggingUtils(gameDTO);
        GameDTOAccess.setZone(gameDTO, this.chosenCard, Zones.REVEALED);
        Log.send(lu.owner(this.chosenCard) + " revealed a(n) " + lu.fname(this.chosenCard));
    }

    populateFromArgs(args: {}): void {
        this.chosenCard = args[RevealCardEvent.CARD_UUID];
    }

    getId(): number {
        return EventIds.REVEAL_CARD;
    }


}

class RevealCardEventArgs extends EventArgs {

    constructor(cardUUID: LogicalVariable) {
        super();
        this.add(RevealCardEvent.CARD_UUID, cardUUID);
    }

}

RegisterEvent(RevealCardEvent);