///<reference path="../GameEvent.ts" />

class DiscardCardsEvent extends GameEvent {

    static CHOSEN_CARD: string = "CHOSEN_CARD";

    chosenCard: string;

    populateFromArgs(args: {}): void {
        this.chosenCard = args[DiscardCardsEvent.CHOSEN_CARD];
    }

    getId(): number {
        return EventIds.DISCARD_CARD;
    }

    execute(gameDTO: GameDTO): void {
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.owner(this.chosenCard) + " discards " + lu.fname(this.chosenCard));
        GameDTOAccess.setZone(gameDTO, this.chosenCard, Zones.DISCARD_PILE);
    }


}

class DiscardCardsEventArgs extends EventArgs {

    constructor(chosenCard: LogicalVariable) {
        super();
        this.add(DiscardCardsEvent.CHOSEN_CARD, chosenCard);
    }

}

RegisterEvent(DiscardCardsEvent);