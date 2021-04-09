class ChapelCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var cardsInHand = GameDTOAccess.getCardsInZone(gameDTO, __this.cardState.ownerUUID, Zones.HAND);

            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(cardsInHand), _.UpTo(_.Value(cardsInHand.length)), "cards_chosen", "Choose card(s) to trash."),
                new ForEachStep(_.Reference("cards_chosen"), "each_card", [
                    new EventGeneratorStep(EventIds.TRASH_CARD, new TrashCardsEventArgs(_.Reference("each_card")))
                ])
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
        return CardIds.CHAPEL;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }



}

RegisterCard(ChapelCardDefinition);