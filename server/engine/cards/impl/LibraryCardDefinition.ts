class LibraryCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;

        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();

            var loadHandSize = new LoadHandInfoStep(LoadHandInfoStepOptions.SIZE, _.Value(__this.cardState.ownerUUID), "hand_size");
            var fullStep = new RelationalStep(_.Reference("hand_size"), RelationalOptions.LESS_THAN, _.Value(7), [
                new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(__this.cardState.ownerUUID), "deckSize"),
                new RelationalStep(_.Reference("deckSize"), RelationalOptions.EQUALS, _.Value(0), [
                    new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(__this.cardState.ownerUUID)))
                ]),
                new LoadDeckInfoStep(LoadDeckInfoStepOptions.TOP_CARD, _.Value(__this.cardState.ownerUUID), "top_card"),
                new DrawCardsStep(__this.cardState.ownerUUID, _.Value(1)),
                new LoadCardInfoStep(LoadCardInfoStepOptions.TYPES, _.Reference("top_card"), "card_types"),
                new ContainsStep(_.Value(CardType.ACTION), _.Reference("card_types"), [
                    new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.STRING, _.Value(["Yes", "No"]), _.Exactly(_.Value(1)), "discardAction", "Discard this card?"),
                    new ConditionalStep(_.Reference("discardAction"), {
                        "Yes": [
                            new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("top_card")))
                        ],
                    })
                ]),
                ,
                new RelationalStep(_.Reference("hand_size"), RelationalOptions.LESS_THAN, _.Value(7), [
                    new JumpToStep(_.Value(loadHandSize.uuid))
                ])
            ]);


            logicalBuffer.addSteps(
                loadHandSize,
                fullStep
            );

            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });

    }


    getCost(): number {
        return 5;
    }

    getVictoryPoints(gameDTO: GameDTO): number {
        return 0;
    }

    getCardId(): number {
        return CardIds.LIBRARY;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }


}

RegisterCard(LibraryCardDefinition);