class PlaceInDeckEvent extends GameEvent {

    static CARD_UUID: string = "CARD_UUID";
    static INDEX: string = "INDEX";

    cardUUID: string;
    index: string;

    populateFromArgs(args: {}): void {
        this.cardUUID = args[PlaceInDeckEvent.CARD_UUID];
        this.index = args[PlaceInDeckEvent.INDEX];
    }
    getId(): number {
        return EventIds.PLACE_IN_DECK;
    }
    execute(gameDTO: GameDTO): void {
        GameDTOAccess.setZone(gameDTO, this.cardUUID, Zones.DECK);
        if (this.index == PlaceInDeckEventOptions.TOP) {
            GameDTOAccess.setDeckIndex(gameDTO, this.cardUUID, deckSize - 1);
        }
        else {
            var owner = GameDTOAccess.getOwner(gameDTO, this.cardUUID)
            var deckSize = GameDTOAccess.getCardsInZone(gameDTO, owner, Zones.DECK).length;
            GameDTOAccess.setDeckIndex(gameDTO, this.cardUUID, 0);
        }
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.owner(this.cardUUID) + " placed " + lu.fname(this.cardUUID) + " at deck position " + this.index);
    }


}

class PlaceInDeckEventArgs extends EventArgs {

    constructor(cardUUID: LogicalVariable, index: LogicalVariable) {
        super();
        this.add(PlaceInDeckEvent.CARD_UUID, cardUUID).add(PlaceInDeckEvent.INDEX, index);
    }
}

class PlaceInDeckEventOptions {
    static TOP = "TOP";
    static BOTTOM = "BOTTOM";
}

RegisterEvent(PlaceInDeckEvent);