class WorkshopCardDefinition extends CardDefinition {


    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {

            var _ = new LogicalUtils();

            var cardChoices = [];
            GameDTOAccess.getAvailableCardTypesInSupply(gameDTO).forEach((eachCardType) => {
                var cardInPile = GameDTOAccess.getNextCardInSupplyPile(gameDTO, eachCardType);
                var definition = GameDTOAccess.getCardDefinition(gameDTO, cardInPile);
                if (definition.getCost() <= 4) {
                    cardChoices.push(cardInPile);
                }
            });

            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(cardChoices), _.Exactly(_.Value(1)), GainCardEvent.CHOSEN_CARD, "Choose a card to gain."),
                new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(__this.cardState.ownerUUID), _.Reference(GainCardEvent.CHOSEN_CARD)))
            );
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }


    getCost(): number {
        return 4;
    }

    getVictoryPoints(gameDTO: GameDTO): number {
        return 0;
    }

    getCardId(): number {
        return CardIds.WORKSHOP;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }


}

RegisterCard(WorkshopCardDefinition);