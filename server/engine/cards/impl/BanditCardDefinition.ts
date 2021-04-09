class BanditCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var goldCardUUID = GameDTOAccess.getNextCardInSupplyPile(gameDTO, CardIds.GOLD);

            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(this.cardState.ownerUUID), _.Value(goldCardUUID)))
            );


            GameDTOAccess.getPlayers(gameDTO).forEach((value) => {
                if (value.uuid != __this.cardState.ownerUUID) {
                    if (!GameDTOAccess.isPlayerUnaffectedByCard(gameDTO, value.uuid, __this.cardState.uuid)) {
                        logicalBuffer.addSteps(
                            new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(value.uuid), "bandit_deckSize"),
                            new RelationalStep(_.Reference("bandit_deckSize"), RelationalOptions.EQUALS, _.Value(0), [
                                new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(value.uuid)))
                            ]),
                            new LoadDeckInfoStep(LoadDeckInfoStepOptions.TOP_CARD, _.Value(value.uuid), "bandit_topCard"),
                            new ArrayStep(ArrayStepOptions.ADD, _.Reference("bandit_topCard"), "bandit_cards_revealed"),
                            new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Reference("bandit_topCard"))),
                            new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(value.uuid), "bandit_deckSize"),
                            new RelationalStep(_.Reference("bandit_deckSize"), RelationalOptions.EQUALS, _.Value(0), [
                                new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(value.uuid)))
                            ]),
                            new LoadDeckInfoStep(LoadDeckInfoStepOptions.TOP_CARD, _.Value(value.uuid), "bandit_topCard"),
                            new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Reference("bandit_topCard"))),
                            new ArrayStep(ArrayStepOptions.ADD, _.Reference("bandit_topCard"), "bandit_cards_revealed"),
                            new ForEachStep(_.Reference("bandit_cards_revealed"), "each_card_revealed", [
                                new LoadCardInfoStep(LoadCardInfoStepOptions.TYPES, _.Reference("each_card_revealed"), "each_card_types"),
                                new ContainsStep(_.Value(CardType.TREASURE), _.Reference("each_card_types"), [
                                    new LoadCardInfoStep(LoadCardInfoStepOptions.CARD_ID, _.Reference("each_card_revealed"), "each_card_id"),
                                    new RelationalStep(_.Reference("each_card_id"), RelationalOptions.NOT_EQ, _.Value(CardIds.COPPER), [
                                        new ArrayStep(ArrayStepOptions.ADD, _.Reference("each_card_revealed"), "non_copper_treasures"),
                                    ])
                                ])
                            ]),
                            new CountStep(_.Reference("non_copper_treasures"), "non_copper_treasures_count"),
                            new ConditionalStep(_.Reference("non_copper_treasures_count"), {
                                0: [
                                    new ForEachStep(_.Reference("bandit_cards_revealed"), "each_card_revealed", [
                                    new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("each_card_revealed")))
                                    ])
                                ],
                                1: [
                                    new EventGeneratorStep(EventIds.TRASH_CARD, new TrashCardsEventArgs(_.Reference("non_copper_treasures"))),
                                    new QueryStep(_.Reference("non_copper_treasures"), QueryStepOptions.NOT_IN, _.Reference("bandit_cards_revealed"), "not_trashed"),
                                    new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("not_trashed")))
                                ],
                                2: [
                                    new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Reference("non_copper_treasures"), _.Exactly(_.Value(1)), "chosen_card_trash", "Choose a card to trash."),
                                    new EventGeneratorStep(EventIds.TRASH_CARD, new TrashCardsEventArgs(_.Reference("chosen_card_trash"))),
                                    new QueryStep(_.Reference("non_copper_treasures"), QueryStepOptions.NOT_IN, _.Reference("bandit_cards_revealed"), "not_trashed"),
                                    new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("not_trashed")))
                                ]
                            })
                        );

                    }
                }
            });

            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });


    }

    getCost(): number {
        return 5;
    }

    getVictoryPoints(): number {
        return 0;
    }

    getCardId(): number {
        return CardIds.BANDIT;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION, CardType.ATTACK];
    }




}

RegisterCard(BanditCardDefinition);
                            /*new ForEachStep(_EffectBufferReference("top_card"), "top_card_value", [
                                new LoadCardInfoStep(LoadCardInfoStepOptions.TYPES, "top_card_value", "card_types"),
                                new LoadCardInfoStep(LoadCardInfoStepOptions.CARD_ID, "top_card_value", "card_id"),
                                new ContainsStep("card_types", {
                                    "TREASURE": [
                                        new RelationalStep("card_id", RelationalOptions.NOT_EQUALS, CardIds.COPPER, [
                                            new StoreValueStep("card_id", "non_copper_treasures")
                                        ])
                                    ]
                                })
                            ]),
                            new QueryStep(_EffectBufferReference("non_copper_treasures"), QueryStepOptions.COUNT, "non_copper_treasures_count"),
                            new RelationalStep("non_copper_treasures_count", RelationalOptions.EQUALS, 1 + "", [
                                new EventGeneratorStep(EventIds.TRASH, new EventGeneratorArgs())
                            ]),
                            new RelationalStep("non_copper_treasures_count", RelationalOptions.EQUALS, 2 + "", [
                                new PlayerChoiceStep(PlayerChoiceType.CARD, _EffectBufferReference("non_copper_treasures"), _Exactly(1), "chosen_card_trash"),
                                new EventGeneratorStep(EventIds.TRASH, new EventGeneratorArgs()),
                                new QueryStep(_EffectBufferReference("top_card"), QueryStepOptions.NOT_IN, _EffectBufferReference("chosen_card_trash"), "not_trashed"),
                                new EventGeneratorStep(EventIds.DISCARD, new EventGeneratorArgs()),
                            ])*/