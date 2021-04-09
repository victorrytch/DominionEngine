class PoacherCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();

            var emptyPilesCount = GameDTOAccess.countEmptySupplyPiles(gameDTO);

            if (emptyPilesCount > 0) {

                logicalBuffer.addSteps(
                    new DrawCardsStep(__this.cardState.ownerUUID, _.Value(1)),
                    new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))),
                    new EventGeneratorStep(EventIds.ADD_ACTION, new AddActionEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))),
                    new LoadHandInfoStep(LoadHandInfoStepOptions.SIZE, _.Value(__this.cardState.ownerUUID), "hand_size"),
                    new MathStep([_.Value(emptyPilesCount), _.Reference("hand_size")], MathStepOptions.MIN, "numberToDiscard"),
                    new LoadHandInfoStep(LoadHandInfoStepOptions.ALL, _.Value(__this.cardState.ownerUUID), "full_hand"),
                    new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Reference("full_hand"), _.Exactly(_.Reference("numberToDiscard")), "chosen_discard", "Choose card(s) to discard."),
                    new ForEachStep(_.Reference("chosen_discard"), "each_card_chosen", [
                        new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("each_card_chosen")))
                    ]),
                );
            }
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
        return CardIds.POACHER;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }



}

RegisterCard(PoacherCardDefinition);
