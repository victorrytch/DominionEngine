////<reference path="../GameEvent.ts" />

class GainCardEvent extends GameEvent {

    static GAIN_LOCATION: string = "GAIN_LOCATION";
    static RECIPIENT: string = "RECIPIENT";
    static CHOSEN_CARD: string = "CHOSEN_CARD";

    recipient: string;
    chosenCard: string;
    gainLocation: Zones;

    populateFromArgs(args: {}): void {
        this.recipient = args[GainCardEvent.RECIPIENT];
        this.chosenCard = args[GainCardEvent.CHOSEN_CARD];

        if (args[GainCardEvent.GAIN_LOCATION] == null) {
            this.gainLocation = Zones.DISCARD_PILE;
        }
        else {
            this.gainLocation = args[GainCardEvent.GAIN_LOCATION];
        }
    }

    getId(): number {
        return EventIds.GAIN_CARD;
    }

    execute(gameDTO: GameDTO): void {
        GameDTOAccess.setOwner(gameDTO, this.chosenCard, this.recipient);
        GameDTOAccess.setZone(gameDTO, this.chosenCard, this.gainLocation);
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.owner(this.chosenCard) + " gained a(n) " + lu.fname(this.chosenCard) + " to " + Zones[this.gainLocation]);
    }


}

class GainCardEventArgs extends EventArgs {

    constructor(recipient: LogicalVariable, chosenCard: LogicalVariable, gainLocation?: LogicalVariable) {
        super();
        this.add(GainCardEvent.RECIPIENT, recipient).add(GainCardEvent.CHOSEN_CARD, chosenCard).add(GainCardEvent.GAIN_LOCATION, gainLocation);
    }

}

RegisterEvent(GainCardEvent);