class MilitiaCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(2)))
            );

            GameDTOAccess.getPlayers(gameDTO).forEach((value) => {
                if (value.uuid != __this.cardState.ownerUUID) {
                    if (!GameDTOAccess.isPlayerUnaffectedByCard(gameDTO, value.uuid, __this.cardState.uuid)) {

                        var cardsInHand = GameDTOAccess.getCardsInZone(gameDTO, value.uuid, Zones.HAND);
                        if (cardsInHand.length > 3) {
 
                            logicalBuffer.addSteps(
                                new PlayerChoiceStep(_.Value(value.uuid), PlayerChoiceType.CARD, _.Value(cardsInHand), _.Exactly(_.Value(cardsInHand.length - 3)), "chosen_cards", "Choose cards to discard"),
                                new ForEachStep(_.Reference("chosen_cards"), "each_card_chosen", [
                                    new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("each_card_chosen")))
                                ]),
                            );
                        }
                    }
                }
            });
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
        return CardIds.MILITIA;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }



}

RegisterCard(MilitiaCardDefinition);