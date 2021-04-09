class TrashCardsEvent extends GameEvent {

    static CARD_UUID: string = "CARD_UUID";

    chosenCard: string;

    populateFromArgs(args: {}): void {
        this.chosenCard = args[TrashCardsEvent.CARD_UUID];
    }

    getId(): number {
        return EventIds.TRASH_CARD;
    }
    execute(gameDTO: GameDTO): void {
        GameDTOAccess.setZone(gameDTO, this.chosenCard, Zones.TRASH);
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.owner(this.chosenCard) + " trashed a(n) " + lu.fname(this.chosenCard));
    }


}

class TrashCardsEventArgs extends EventArgs {

    constructor(cardUUID: LogicalVariable) {
        super();
        this.add(PlaceInDeckEvent.CARD_UUID, cardUUID);
    }
}

RegisterEvent(TrashCardsEvent);