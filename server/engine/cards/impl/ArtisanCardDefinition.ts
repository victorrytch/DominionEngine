class ArtisanCardDefinition extends CardDefinition {


    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {

            var gainOptions = [];
            GameDTOAccess.getAvailableCardTypesInSupply(gameDTO).forEach((value) => {
                var topCardUUID = GameDTOAccess.getNextCardInSupplyPile(gameDTO, value);
                if (GameDTOAccess.getCardDefinition(gameDTO, topCardUUID).getCost() <= 5) {
                    gainOptions.push(topCardUUID);
                }
            });

            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(gainOptions), _.Exactly(_.Value(1)), GainCardEvent.CHOSEN_CARD, "Choose a card to gain."),
                new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(__this.cardState.ownerUUID), _.Reference(GainCardEvent.CHOSEN_CARD))),
                new LoadHandInfoStep(LoadHandInfoStepOptions.ALL, _.Value(__this.cardState.ownerUUID), "player_hand"),
                new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Reference("player_hand"), _.Exactly(_.Value(1)), "card_to_place_on_deck", "Choose a card to place on deck."),
                new EventGeneratorStep(EventIds.SET_CARD_ONTO_DECK, new SetCardOntoDeckEventArgs(_.Value(__this.cardState.ownerUUID), _.Reference("card_to_place_on_deck")))
            );

            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }

    getCost(): number {
        return 6;
    }

    getVictoryPoints(): number {
        return 0;
    }

    getCardId(): number {
        return CardIds.ARTISAN;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }


}

RegisterCard(ArtisanCardDefinition);