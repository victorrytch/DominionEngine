///<reference path="../GameEvent.ts" />

class SetCardOntoDeckEvent extends GameEvent {


    static AFFECTED_PLAYER: string = "RECIPIENT";
    static CHOSEN_CARD: string = "CHOSEN_CARD";

    recipient: string;
    chosenCard: string;

    populateFromArgs(args: {}): void {
        this.recipient = args[SetCardOntoDeckEvent.AFFECTED_PLAYER];
        this.chosenCard = args[SetCardOntoDeckEvent.CHOSEN_CARD];
    }

    getId(): number {
        return EventIds.SET_CARD_ONTO_DECK;
    }

    execute(gameDTO: GameDTO): void {
        var lu = new LoggingUtils(gameDTO);
        GameDTOAccess.setZone(gameDTO, this.chosenCard, Zones.DECK);
        var deckSize = GameDTOAccess.getCardsInZone(gameDTO, this.recipient, Zones.DECK).length;
        GameDTOAccess.setDeckIndex(gameDTO, this.chosenCard, deckSize - 1);
        Log.send(lu.owner(this.chosenCard) + " puts " + lu.fname(this.chosenCard) + " on top of the deck.");
    }


}

class SetCardOntoDeckEventArgs extends EventArgs {

    constructor(affectedPlayers: LogicalVariable, chosenCard: LogicalVariable) {
        super();
        this.add(SetCardOntoDeckEvent.AFFECTED_PLAYER, affectedPlayers).add(SetCardOntoDeckEvent.CHOSEN_CARD, chosenCard);
    }

}

RegisterEvent(SetCardOntoDeckEvent);