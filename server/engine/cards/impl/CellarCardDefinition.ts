class CellarCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {

            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new EventGeneratorStep(EventIds.ADD_ACTION, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1)))
            );

            var cardsInHand = GameDTOAccess.getCardsInZone(gameDTO, __this.cardState.ownerUUID, Zones.HAND);

            logicalBuffer.addSteps(
                new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(cardsInHand), _.UpTo(_.Value(cardsInHand.length)), "cards_chosen", "Choose card(s) to discard."),
                new ForEachStep(_.Reference("cards_chosen"), "each_card_chosen", [
                    new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("each_card_chosen")))
                    ]),
                new CountStep(_.Reference("cards_chosen"), "cards_discarded_count"),
                new DrawCardsStep(__this.cardState.ownerUUID, _.Reference("cards_discarded_count"))
            );

            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }

    getCost(): number {
        return 2;
    }

    getVictoryPoints(): number {
        return 0;
    }


    getCardId(): number {
        return CardIds.CELLAR;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }


}

RegisterCard(CellarCardDefinition);