class VassalCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(

            );

            var cardsOnDeck: string[] = GameDTOAccess.getCardsOnDeck(gameDTO, __this.cardState.ownerUUID, 1);

            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();

            logicalBuffer.addSteps(
                new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(2))),
                new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(__this.cardState.ownerUUID), "deck_size"),
                new RelationalStep(_.Reference("deck_size"), RelationalOptions.EQUALS, _.Value(0), [
                    new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(__this.cardState.ownerUUID)))
                ]),
                new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(__this.cardState.ownerUUID), "deck_size"),
                new RelationalStep(_.Reference("deck_size"), RelationalOptions.GREATER_THAN, _.Value(0), [
                    new LoadDeckInfoStep(LoadDeckInfoStepOptions.TOP_CARD, _.Value(__this.cardState.ownerUUID), "top_card"),
                    new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Reference("top_card"))),
                    new LoadCardInfoStep(LoadCardInfoStepOptions.TYPES, _.Reference("top_card"), "card_revealed_types"),
                    new ContainsStep(_.Value(CardType.ACTION), _.Reference("card_revealed_types"), [
                        new EventGeneratorStep(EventIds.CARD_PLAYED, new CardPlayedEventArgs(_.Reference("top_card")))
                    ]),
                    new ContainsStep(_.Value(CardType.ACTION), _.Reference("card_revealed_types"), [
                        new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("top_card")))
                    ], ContainsStep.DOES_NOT_CONTAIN)
                ])
            );

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
        return CardIds.VASSAL;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }


}

RegisterCard(VassalCardDefinition);