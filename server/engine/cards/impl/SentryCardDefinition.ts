///<reference path="../CardDefinition.ts" />

class SentryCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new DrawCardsStep(__this.cardState.ownerUUID, _.Value(1)),
                new EventGeneratorStep(EventIds.ADD_ACTION, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1)))
            );
            
            logicalBuffer.addSteps(
                new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(__this.cardState.ownerUUID), "deck_size"),
                new RelationalStep(_.Reference("deck_size"), RelationalOptions.EQUALS, _.Value(0), [
                    new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(__this.cardState.ownerUUID)))
                ]),
                new LoadDeckInfoStep(LoadDeckInfoStepOptions.TOP_CARD, _.Value(__this.cardState.ownerUUID), "top_card"),
                new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Reference("top_card"))),

                new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(__this.cardState.ownerUUID), "deck_size"),
                new RelationalStep(_.Reference("deck_size"), RelationalOptions.EQUALS, _.Value(0), [
                    new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(__this.cardState.ownerUUID)))
                ]),
                new LoadDeckInfoStep(new LoadDeckStepCardAtIndexFromTopOption(1), _.Value(__this.cardState.ownerUUID), "top_card_2"),
                new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Reference("top_card_2"))),

                new ArrayStep(ArrayStepOptions.ADD, _.Reference("top_card"), "cards_revealed"),
                new ArrayStep(ArrayStepOptions.ADD, _.Reference("top_card_2"), "cards_revealed"),

                new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Reference("cards_revealed"), _.UpTo(_.Value(2)), "chosen_cards_trash", "Choose card(s) to trash."),
                new QueryStep(_.Reference("chosen_cards_trash"), QueryStepOptions.NOT_IN, _.Reference("cards_revealed"), "chosen_cards_not_trashed"),
                new CountStep(_.Reference("chosen_cards_not_trashed"), "num_chosen_cards_not_trashed"),
                new RelationalStep(_.Reference("num_chosen_cards_not_trashed"), RelationalOptions.GREATER_THAN, _.Value(0), [

                    new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Reference("chosen_cards_not_trashed"), _.UpTo(_.Reference("num_chosen_cards_not_trashed")), "chosen_cards_discard", "Choose card(s) to discard."),
                    new QueryStep(_.Reference("chosen_cards_discard"), QueryStepOptions.NOT_IN, _.Reference("chosen_cards_not_trashed"), "chosen_cards_not_discarded"),
                    new CountStep(_.Reference("chosen_cards_not_discarded"), "num_chosen_cards_not_discarded"),
                    new RelationalStep(_.Reference("num_chosen_cards_not_discarded"), RelationalOptions.EQUALS, _.Value(1), [
                        new EventGeneratorStep(EventIds.PLACE_IN_DECK, new PlaceInDeckEventArgs(_.Reference("chosen_cards_not_discarded"), _.Value(PlaceInDeckEventOptions.TOP)))
                    ]),
                    new RelationalStep(_.Reference("num_chosen_cards_not_discarded"), RelationalOptions.EQUALS, _.Value(2), [
                        new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Reference("chosen_cards_not_discarded"), _.Exactly(_.Value(1)), "card_to_put_back_first", "Choose first card to put on deck."),
                        new QueryStep(_.Reference("card_to_put_back_first"), QueryStepOptions.NOT_IN, _.Reference("chosen_cards_not_discarded"), "card_to_put_back_second"),
                        new EventGeneratorStep(EventIds.PLACE_IN_DECK, new PlaceInDeckEventArgs(_.Reference("card_to_put_back_second"), _.Value(PlaceInDeckEventOptions.TOP))),
                        new EventGeneratorStep(EventIds.PLACE_IN_DECK, new PlaceInDeckEventArgs(_.Reference("card_to_put_back_first"), _.Value(PlaceInDeckEventOptions.TOP)))
                    ]),
                    new ForEachStep(_.Reference("chosen_cards_discard"), "each_card_chosen", [
                        new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("each_card_chosen")))
                    ])
                ]),

                new ForEachStep(_.Reference("chosen_cards_trash"), "each_card_chosen", [
                    new EventGeneratorStep(EventIds.TRASH_CARD, new TrashCardsEventArgs(_.Reference("each_card_chosen")))
                ])
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
        return CardIds.SENTRY;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }



}

RegisterCard(SentryCardDefinition);
