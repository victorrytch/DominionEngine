class HarbingerCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new DrawCardsStep(__this.cardState.ownerUUID, _.Value(1)),
                new EventGeneratorStep(EventIds.ADD_ACTION, new AddActionEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1)))
            );

            var discardPileCards = GameDTOAccess.getCardsInZone(gameDTO, __this.cardState.ownerUUID, Zones.DISCARD_PILE);

            if (discardPileCards.length > 0) {
                logicalBuffer.addSteps(
                    new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(discardPileCards), _.Exactly(_.Value(1)), GainCardEvent.CHOSEN_CARD, "Choose a card to place on the deck."),
                    new EventGeneratorStep(EventIds.PLACE_IN_DECK, new PlaceInDeckEventArgs(_.Reference(GainCardEvent.CHOSEN_CARD), _.Value(PlaceInDeckEventOptions.TOP)))
                );
            }
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }


    getCost(): number {
        return 3;
    }

    getVictoryPoints(gameDTO: GameDTO): number {
        return 0;
    }

    getCardId(): number {
        return CardIds.HARBINGER;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }


}

RegisterCard(HarbingerCardDefinition);