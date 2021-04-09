class CardPlayedEvent extends GameEvent {

    static CARD_UUID: string = "CARD_UUID";

    CARD_UUID: string;

    execute(gameDTO: GameDTO): void {
        GameDTOAccess.setZone(gameDTO, this.CARD_UUID, Zones.IN_PLAY);
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.owner(this.CARD_UUID) + " played " + lu.fname(this.CARD_UUID));
    }

    populateFromArgs(args: {}): void {
        this.CARD_UUID = args[CardPlayedEvent.CARD_UUID];
    }

    getId(): number {
        return EventIds.CARD_PLAYED;
    }

}

class CardPlayedEventArgs extends EventArgs {

    constructor(cardUUID: LogicalVariable) {
        super();
        this.add(CardPlayedEvent.CARD_UUID, cardUUID);
    }

}

RegisterEvent(CardPlayedEvent);