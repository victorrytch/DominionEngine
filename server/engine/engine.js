class CardDefinition {
    constructor(cardState) {
        this.reactions = [];
        if (!(cardState instanceof EmptyCardArgs)) {
            this.cardState = cardState;
            this.setReactions();
        }
    }
    static registerCardGenerator(id, generator) {
        CardDefinition.CARD_DEFINITIONS[id] = generator;
    }
    static create(id, state) {
        return CardDefinition.CARD_DEFINITIONS[id](state);
    }
    static createFromDTO(dto) {
        var state = new CardState(dto.uuid, dto.zoneId, dto.ownerUUID);
        return CardDefinition.CARD_DEFINITIONS[dto.definitionId](state);
    }
    canPlay(gameDTO) {
        var result = false;
        if (gameDTO.state.phase == Phase.ACTION) {
            if (this.hasType(CardType.ACTION)) {
                result = true;
            }
        }
        else if (gameDTO.state.phase == Phase.BUY) {
            if (this.hasType(CardType.TREASURE)) {
                result = true;
            }
        }
        return result;
    }
    getReactions() {
        return this.reactions;
    }
    addOnPlay(effectLogic) {
        var _this = this;
        var onPlay = new Reaction(EventStatus.RESOLVED, (event, gameDTO) => {
            if ((event.getId() == EventIds.CARD_PLAYED) && (event.args[CardPlayedEvent.CARD_UUID] == _this.cardState.uuid)) {
                return true;
            }
            return false;
        }, effectLogic);
        this.reactions.push(onPlay);
    }
    configureGenerator() {
        var _this = this;
        CardDefinition.registerCardGenerator(this.getCardId(), (state) => {
            var instance = new _this.constructor(state);
            return instance;
        });
    }
    hasType(cardType) {
        var result = false;
        this.getCardTypes().forEach((value) => {
            if (value == cardType) {
                result = true;
            }
        });
        return result;
    }
}
CardDefinition.CARD_DEFINITIONS = {};
class EmptyCardArgs {
}
function RegisterCard(cardType) {
    new cardType(new EmptyCardArgs()).configureGenerator();
}
var CardIds;
(function (CardIds) {
    CardIds[CardIds["COPPER"] = 0] = "COPPER";
    CardIds[CardIds["WORKSHOP"] = 1] = "WORKSHOP";
    CardIds[CardIds["WITCH"] = 2] = "WITCH";
    CardIds[CardIds["MOAT"] = 3] = "MOAT";
    CardIds[CardIds["CELLAR"] = 4] = "CELLAR";
    CardIds[CardIds["LIBRARY"] = 5] = "LIBRARY";
    CardIds[CardIds["GOLD"] = 6] = "GOLD";
    CardIds[CardIds["SILVER"] = 7] = "SILVER";
    CardIds[CardIds["CURSE"] = 8] = "CURSE";
    CardIds[CardIds["ARTISAN"] = 9] = "ARTISAN";
    CardIds[CardIds["BANDIT"] = 10] = "BANDIT";
    CardIds[CardIds["BUREAUCRAT"] = 11] = "BUREAUCRAT";
    CardIds[CardIds["CHAPEL"] = 12] = "CHAPEL";
    CardIds[CardIds["COUNCIL_ROOM"] = 13] = "COUNCIL_ROOM";
    CardIds[CardIds["DUCHY"] = 14] = "DUCHY";
    CardIds[CardIds["ESTATE"] = 15] = "ESTATE";
    CardIds[CardIds["FESTIVAL"] = 16] = "FESTIVAL";
    CardIds[CardIds["GARDENS"] = 17] = "GARDENS";
    CardIds[CardIds["HARBINGER"] = 18] = "HARBINGER";
    CardIds[CardIds["LABORATORY"] = 19] = "LABORATORY";
    CardIds[CardIds["MARKET"] = 20] = "MARKET";
    CardIds[CardIds["MERCHANT"] = 21] = "MERCHANT";
    CardIds[CardIds["MILITIA"] = 22] = "MILITIA";
    CardIds[CardIds["MINE"] = 23] = "MINE";
    CardIds[CardIds["MONEYLENDER"] = 24] = "MONEYLENDER";
    CardIds[CardIds["POACHER"] = 25] = "POACHER";
    CardIds[CardIds["PROVINCE"] = 26] = "PROVINCE";
    CardIds[CardIds["REMODEL"] = 27] = "REMODEL";
    CardIds[CardIds["SENTRY"] = 28] = "SENTRY";
    CardIds[CardIds["SMITHY"] = 29] = "SMITHY";
    CardIds[CardIds["THRONE_ROOM"] = 30] = "THRONE_ROOM";
    CardIds[CardIds["VASSAL"] = 31] = "VASSAL";
    CardIds[CardIds["VILLAGE"] = 32] = "VILLAGE";
})(CardIds || (CardIds = {}));
class CardState {
    constructor(uuid, zoneId, ownerUUID) {
        this.uuid = uuid;
        this.zoneId = zoneId;
        this.ownerUUID = ownerUUID;
    }
}
var CardType;
(function (CardType) {
    CardType[CardType["TREASURE"] = 0] = "TREASURE";
    CardType[CardType["ACTION"] = 1] = "ACTION";
    CardType[CardType["VICTORY"] = 2] = "VICTORY";
    CardType[CardType["ATTACK"] = 3] = "ATTACK";
    CardType[CardType["REACTION"] = 4] = "REACTION";
    CardType[CardType["CURSE"] = 5] = "CURSE";
})(CardType || (CardType = {}));
class ArtisanCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var gainOptions = [];
            GameDTOAccess.getAvailableCardTypesInSupply(gameDTO).forEach((value) => {
                var topCardUUID = GameDTOAccess.getNextCardInSupplyPile(gameDTO, value);
                if (GameDTOAccess.getCardDefinition(gameDTO, topCardUUID).getCost() <= 5) {
                    gainOptions.push(topCardUUID);
                }
            });
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(gainOptions), _.Exactly(_.Value(1)), GainCardEvent.CHOSEN_CARD, "Choose a card to gain."), new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(__this.cardState.ownerUUID), _.Reference(GainCardEvent.CHOSEN_CARD))), new LoadHandInfoStep(LoadHandInfoStepOptions.ALL, _.Value(__this.cardState.ownerUUID), "player_hand"), new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Reference("player_hand"), _.Exactly(_.Value(1)), "card_to_place_on_deck", "Choose a card to place on deck."), new EventGeneratorStep(EventIds.SET_CARD_ONTO_DECK, new SetCardOntoDeckEventArgs(_.Value(__this.cardState.ownerUUID), _.Reference("card_to_place_on_deck"))));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 6;
    }
    getVictoryPoints() {
        return 0;
    }
    getCardId() {
        return CardIds.ARTISAN;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(ArtisanCardDefinition);
class BanditCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var goldCardUUID = GameDTOAccess.getNextCardInSupplyPile(gameDTO, CardIds.GOLD);
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(this.cardState.ownerUUID), _.Value(goldCardUUID))));
            GameDTOAccess.getPlayers(gameDTO).forEach((value) => {
                if (value.uuid != __this.cardState.ownerUUID) {
                    if (!GameDTOAccess.isPlayerUnaffectedByCard(gameDTO, value.uuid, __this.cardState.uuid)) {
                        logicalBuffer.addSteps(new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(value.uuid), "bandit_deckSize"), new RelationalStep(_.Reference("bandit_deckSize"), RelationalOptions.EQUALS, _.Value(0), [
                            new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(value.uuid)))
                        ]), new LoadDeckInfoStep(LoadDeckInfoStepOptions.TOP_CARD, _.Value(value.uuid), "bandit_topCard"), new ArrayStep(ArrayStepOptions.ADD, _.Reference("bandit_topCard"), "bandit_cards_revealed"), new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Reference("bandit_topCard"))), new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(value.uuid), "bandit_deckSize"), new RelationalStep(_.Reference("bandit_deckSize"), RelationalOptions.EQUALS, _.Value(0), [
                            new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(value.uuid)))
                        ]), new LoadDeckInfoStep(LoadDeckInfoStepOptions.TOP_CARD, _.Value(value.uuid), "bandit_topCard"), new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Reference("bandit_topCard"))), new ArrayStep(ArrayStepOptions.ADD, _.Reference("bandit_topCard"), "bandit_cards_revealed"), new ForEachStep(_.Reference("bandit_cards_revealed"), "each_card_revealed", [
                            new LoadCardInfoStep(LoadCardInfoStepOptions.TYPES, _.Reference("each_card_revealed"), "each_card_types"),
                            new ContainsStep(_.Value(CardType.TREASURE), _.Reference("each_card_types"), [
                                new LoadCardInfoStep(LoadCardInfoStepOptions.CARD_ID, _.Reference("each_card_revealed"), "each_card_id"),
                                new RelationalStep(_.Reference("each_card_id"), RelationalOptions.NOT_EQ, _.Value(CardIds.COPPER), [
                                    new ArrayStep(ArrayStepOptions.ADD, _.Reference("each_card_revealed"), "non_copper_treasures"),
                                ])
                            ])
                        ]), new CountStep(_.Reference("non_copper_treasures"), "non_copper_treasures_count"), new ConditionalStep(_.Reference("non_copper_treasures_count"), {
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
                        }));
                    }
                }
            });
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 5;
    }
    getVictoryPoints() {
        return 0;
    }
    getCardId() {
        return CardIds.BANDIT;
    }
    getCardTypes() {
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
class BureaucratCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var silverCardUUID = GameDTOAccess.getNextCardInSupplyPile(gameDTO, CardIds.SILVER);
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(silverCardUUID))));
            GameDTOAccess.getPlayers(gameDTO).forEach((value) => {
                if (value.uuid != __this.cardState.ownerUUID) {
                    if (!GameDTOAccess.isPlayerUnaffectedByCard(gameDTO, value.uuid, __this.cardState.uuid)) {
                        var victoriesInHand = GameDTOAccess.getVictoriesInHand(gameDTO, value.uuid);
                        if (victoriesInHand.length > 0) {
                            logicalBuffer.addSteps(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(GameDTOAccess.getVictoriesInHand(gameDTO, value.uuid)), _.Exactly(_.Value(1), "Choose card to place on deck."), "chosen_card"), new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Reference("chosen_card"))), new EventGeneratorStep(EventIds.PLACE_IN_DECK, new PlaceInDeckEventArgs(_.Reference("chosen_card"), _.Value(PlaceInDeckEventOptions.TOP))));
                        }
                    }
                }
            });
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 4;
    }
    getVictoryPoints() {
        return 0;
    }
    getCardId() {
        return CardIds.BUREAUCRAT;
    }
    getCardTypes() {
        return [CardType.ACTION, CardType.ATTACK];
    }
}
RegisterCard(BureaucratCardDefinition);
class CellarCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new EventGeneratorStep(EventIds.ADD_ACTION, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))));
            var cardsInHand = GameDTOAccess.getCardsInZone(gameDTO, __this.cardState.ownerUUID, Zones.HAND);
            logicalBuffer.addSteps(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(cardsInHand), _.UpTo(_.Value(cardsInHand.length)), "cards_chosen", "Choose card(s) to discard."), new ForEachStep(_.Reference("cards_chosen"), "each_card_chosen", [
                new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("each_card_chosen")))
            ]), new CountStep(_.Reference("cards_chosen"), "cards_discarded_count"), new DrawCardsStep(__this.cardState.ownerUUID, _.Reference("cards_discarded_count")));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 2;
    }
    getVictoryPoints() {
        return 0;
    }
    getCardId() {
        return CardIds.CELLAR;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(CellarCardDefinition);
class ChapelCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var cardsInHand = GameDTOAccess.getCardsInZone(gameDTO, __this.cardState.ownerUUID, Zones.HAND);
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(cardsInHand), _.UpTo(_.Value(cardsInHand.length)), "cards_chosen", "Choose card(s) to trash."), new ForEachStep(_.Reference("cards_chosen"), "each_card", [
                new EventGeneratorStep(EventIds.TRASH_CARD, new TrashCardsEventArgs(_.Reference("each_card")))
            ]));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 2;
    }
    getVictoryPoints() {
        return 0;
    }
    getCardId() {
        return CardIds.CHAPEL;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(ChapelCardDefinition);
class CopperCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 0;
    }
    getVictoryPoints() {
        return 0;
    }
    getCardId() {
        return CardIds.COPPER;
    }
    getCardTypes() {
        return [CardType.TREASURE];
    }
}
RegisterCard(CopperCardDefinition);
class CouncilRoomCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new DrawCardsStep(__this.cardState.ownerUUID, _.Value(4)), new EventGeneratorStep(EventIds.ADD_BUYS, new AddBuysEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))));
            GameDTOAccess.getPlayers(gameDTO).forEach((value) => {
                if (value.uuid != __this.cardState.ownerUUID) {
                    logicalBuffer.addStep(new DrawCardsStep(value.uuid, _.Value(1)));
                }
            });
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 5;
    }
    getVictoryPoints() {
        return 0;
    }
    getCardId() {
        return CardIds.COUNCIL_ROOM;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(CouncilRoomCardDefinition);
class CurseCardDefinition extends CardDefinition {
    setReactions() {
    }
    getCost() {
        return 0;
    }
    getVictoryPoints() {
        return -1;
    }
    getCardId() {
        return CardIds.CURSE;
    }
    getCardTypes() {
        return [CardType.CURSE];
    }
}
RegisterCard(CurseCardDefinition);
class DuchyCardDefinition extends CardDefinition {
    setReactions() {
    }
    getCost() {
        return 5;
    }
    getVictoryPoints(gameDTO) {
        return 3;
    }
    getCardId() {
        return CardIds.DUCHY;
    }
    getCardTypes() {
        return [CardType.VICTORY];
    }
}
RegisterCard(DuchyCardDefinition);
class EstateCardDefinition extends CardDefinition {
    setReactions() {
    }
    getCost() {
        return 2;
    }
    getVictoryPoints(gameDTO) {
        return 1;
    }
    getCardId() {
        return CardIds.ESTATE;
    }
    getCardTypes() {
        return [CardType.VICTORY];
    }
}
RegisterCard(EstateCardDefinition);
class FestivalCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new EventGeneratorStep(EventIds.ADD_ACTION, new AddActionEventArgs(_.Value(this.cardState.ownerUUID), _.Value(2))), new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))), new EventGeneratorStep(EventIds.ADD_BUYS, new AddBuysEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 5;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.FESTIVAL;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(FestivalCardDefinition);
class GardensCardDefinition extends CardDefinition {
    setReactions() {
    }
    getCost() {
        return 4;
    }
    getVictoryPoints(gameDTO) {
        return Math.floor(GameDTOAccess.getAllCardsOwnedBy(gameDTO, this.cardState.ownerUUID).length / 10);
    }
    getCardId() {
        return CardIds.GARDENS;
    }
    getCardTypes() {
        return [CardType.VICTORY];
    }
}
RegisterCard(GardensCardDefinition);
class GoldCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(3))));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 6;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.GOLD;
    }
    getCardTypes() {
        return [CardType.TREASURE];
    }
}
RegisterCard(GoldCardDefinition);
class HarbingerCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new DrawCardsStep(__this.cardState.ownerUUID, _.Value(1)), new EventGeneratorStep(EventIds.ADD_ACTION, new AddActionEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))));
            var discardPileCards = GameDTOAccess.getCardsInZone(gameDTO, __this.cardState.ownerUUID, Zones.DISCARD_PILE);
            if (discardPileCards.length > 0) {
                logicalBuffer.addSteps(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(discardPileCards), _.Exactly(_.Value(1)), GainCardEvent.CHOSEN_CARD, "Choose a card to place on the deck."), new EventGeneratorStep(EventIds.PLACE_IN_DECK, new PlaceInDeckEventArgs(_.Reference(GainCardEvent.CHOSEN_CARD), _.Value(PlaceInDeckEventOptions.TOP))));
            }
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 3;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.HARBINGER;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(HarbingerCardDefinition);
class LaboratoryCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new DrawCardsStep(__this.cardState.ownerUUID, _.Value(2)), new EventGeneratorStep(EventIds.ADD_ACTION, new AddActionEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 5;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.LABORATORY;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(LaboratoryCardDefinition);
class LibraryCardDefinition extends CardDefinition {
    setReactions() {
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
            logicalBuffer.addSteps(loadHandSize, fullStep);
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 5;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.LIBRARY;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(LibraryCardDefinition);
class MarketCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new DrawCardsStep(__this.cardState.ownerUUID, _.Value(1)), new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))), new EventGeneratorStep(EventIds.ADD_BUYS, new AddBuysEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))), new EventGeneratorStep(EventIds.ADD_ACTION, new AddActionEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 5;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.MARKET;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(MarketCardDefinition);
class MerchantCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new DrawCardsStep(__this.cardState.ownerUUID, _.Value(1)), new EventGeneratorStep(EventIds.ADD_ACTION, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
        this.reactions.push(new Reaction(EventStatus.RESOLVED, (event, gameDTO) => {
            if (__this.cardState.zoneId == Zones.IN_PLAY) {
                var silversInPlay = GameDTOAccess.getCardsInZone(gameDTO, __this.cardState.ownerUUID, Zones.IN_PLAY).filter((value) => {
                    return GameDTOAccess.getCardDefinition(gameDTO, value).getCardId() == CardIds.SILVER;
                });
                if (event.getId() == EventIds.CARD_PLAYED &&
                    event.args[CardPlayedEvent.CARD_UUID] != __this.cardState.uuid &&
                    GameDTOAccess.getCardDefinition(gameDTO, event.args[CardPlayedEvent.CARD_UUID]).getCardId() == CardIds.SILVER &&
                    silversInPlay.length == 1) {
                    return true;
                }
            }
            return false;
        }, (event, gameDTO) => {
            var lu = new LoggingUtils(gameDTO);
            Log.send(lu.fname(__this.cardState.ownerUUID) + " recieved +1 money from MERCHANT");
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        }));
    }
    getCost() {
        return 3;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.MERCHANT;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(MerchantCardDefinition);
class MilitiaCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(2))));
            GameDTOAccess.getPlayers(gameDTO).forEach((value) => {
                if (value.uuid != __this.cardState.ownerUUID) {
                    if (!GameDTOAccess.isPlayerUnaffectedByCard(gameDTO, value.uuid, __this.cardState.uuid)) {
                        var cardsInHand = GameDTOAccess.getCardsInZone(gameDTO, value.uuid, Zones.HAND);
                        if (cardsInHand.length > 3) {
                            logicalBuffer.addSteps(new PlayerChoiceStep(_.Value(value.uuid), PlayerChoiceType.CARD, _.Value(cardsInHand), _.Exactly(_.Value(cardsInHand.length - 3)), "chosen_cards", "Choose cards to discard"), new ForEachStep(_.Reference("chosen_cards"), "each_card_chosen", [
                                new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("each_card_chosen")))
                            ]));
                        }
                    }
                }
            });
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 4;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.MILITIA;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(MilitiaCardDefinition);
class MineCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            var trashOptions = GameDTOAccess.getCardsInZone(gameDTO, __this.cardState.ownerUUID, Zones.HAND).filter((value) => {
                return Util.contains(GameDTOAccess.getCardDefinition(gameDTO, value).getCardTypes(), CardType.TREASURE);
            });
            if (trashOptions.length > 0) {
                var conditionMap = {};
                trashOptions.forEach((value) => {
                    var options = [];
                    var trashedValue = GameDTOAccess.getCardDefinition(gameDTO, value).getCost();
                    GameDTOAccess.getAvailableCardTypesInSupply(gameDTO).forEach((eachCardTypeInSupply) => {
                        var eachCard = GameDTOAccess.getNextCardInSupplyPile(gameDTO, eachCardTypeInSupply);
                        var definition = GameDTOAccess.getCardDefinition(gameDTO, eachCard);
                        if (Util.contains(definition.getCardTypes(), CardType.TREASURE) && definition.getCost() <= (trashedValue + 3)) {
                            options.push(definition.cardState.uuid);
                        }
                    });
                    conditionMap[value] = [];
                    conditionMap[value].push(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(options), _.Exactly(_.Value(1)), "gained_card", "Choose a treasure to gain."));
                    conditionMap[value].push(new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(__this.cardState.ownerUUID), _.Reference("gained_card"), _.Value(Zones.HAND))));
                });
                logicalBuffer.addSteps(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(trashOptions), _.UpTo(_.Value(1)), "trashed_card", "Choose a treasure to trash."), new CountStep(_.Reference("trashed_card"), "chosen_trashed_card_count"), new RelationalStep(_.Reference("chosen_trashed_card_count"), RelationalOptions.GREATER_THAN, _.Value(0), [
                    new EventGeneratorStep(EventIds.TRASH_CARD, new TrashCardsEventArgs(_.Reference("trashed_card"))),
                    new ConditionalStep(_.Reference("trashed_card"), conditionMap)
                ]));
            }
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 5;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.MINE;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(MineCardDefinition);
class MoatCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new DrawCardsStep(__this.cardState.ownerUUID, _.Value(2)));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
        this.reactions.push(new Reaction(EventStatus.DECLARED, (event, gameDTO) => {
            if (event.getId() == EventIds.CARD_PLAYED &&
                event.eventSourceUUID != __this.cardState.ownerUUID &&
                GameDTOAccess.getCardDefinition(gameDTO, event.args[CardPlayedEvent.CARD_UUID]).hasType(CardType.ATTACK)) {
                return true;
            }
            return false;
        }, (event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addStep(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.STRING, _.Value(["Yes", "No"]), _.Exactly(_.Value(1)), "revealMoatDecision", "Reveal MOAT?"));
            logicalBuffer.addStep(new ConditionalStep(_.Reference("revealMoatDecision"), {
                "Yes": [
                    new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Value(__this.cardState.uuid))),
                    new EventGeneratorStep(EventIds.SET_UNAFFECTED, new SetUnaffectedEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(event.args[CardPlayedEvent.CARD_UUID]), _.Value(SetUnaffectedEventAction.SET)))
                ]
            }));
        }));
        this.reactions.push(new Reaction(EventStatus.RESOLVED, (event, gameDTO) => {
            if (event.getId() == EventIds.CARD_PLAYED && event.eventSourceUUID != GameDTOAccess.getOwner(gameDTO, __this.cardState.uuid) && GameDTOAccess.getCardDefinition(gameDTO, event.args[CardPlayedEvent.CARD_UUID]).hasType(CardType.ATTACK)) {
                return true;
            }
            return false;
        }, (event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addStep(new EventGeneratorStep(EventIds.SET_UNAFFECTED, new SetUnaffectedEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(event.args[CardPlayedEvent.CARD_UUID]), _.Value(SetUnaffectedEventAction.REMOVE))));
        }));
    }
    getCost() {
        return 2;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.MOAT;
    }
    getCardTypes() {
        return [CardType.ACTION, CardType.REACTION];
    }
}
RegisterCard(MoatCardDefinition);
class MoneylenderCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var coppers = GameDTOAccess.getCardsInZone(gameDTO, __this.cardState.ownerUUID, Zones.HAND).filter((eachCardInHand) => {
                return GameDTOAccess.getCardDefinition(gameDTO, eachCardInHand).getCardId() == CardIds.COPPER;
            });
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            if (coppers.length > 0) {
                logicalBuffer.addSteps(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(["Yes", "No"]), _.Exactly(_.Value(1)), "trash_copper_decision", "Choose a COPPER to trash."), new ConditionalStep(_.Reference("trash_copper_decision"), {
                    "Yes": [
                        new EventGeneratorStep(EventIds.TRASH_CARD, new TrashCardsEventArgs(_.Value(coppers[0]))),
                        new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(3)))
                    ]
                }));
            }
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 4;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.MONEYLENDER;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(MoneylenderCardDefinition);
class PoacherCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            var emptyPilesCount = GameDTOAccess.countEmptySupplyPiles(gameDTO);
            if (emptyPilesCount > 0) {
                logicalBuffer.addSteps(new DrawCardsStep(__this.cardState.ownerUUID, _.Value(1)), new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))), new EventGeneratorStep(EventIds.ADD_ACTION, new AddActionEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))), new LoadHandInfoStep(LoadHandInfoStepOptions.SIZE, _.Value(__this.cardState.ownerUUID), "hand_size"), new MathStep([_.Value(emptyPilesCount), _.Reference("hand_size")], MathStepOptions.MIN, "numberToDiscard"), new LoadHandInfoStep(LoadHandInfoStepOptions.ALL, _.Value(__this.cardState.ownerUUID), "full_hand"), new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Reference("full_hand"), _.Exactly(_.Reference("numberToDiscard")), "chosen_discard", "Choose card(s) to discard."), new ForEachStep(_.Reference("chosen_discard"), "each_card_chosen", [
                    new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("each_card_chosen")))
                ]));
            }
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 4;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.POACHER;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(PoacherCardDefinition);
class ProvidenceCardDefinition extends CardDefinition {
    setReactions() {
    }
    getCost() {
        return 8;
    }
    getVictoryPoints(gameDTO) {
        return 6;
    }
    getCardId() {
        return CardIds.PROVINCE;
    }
    getCardTypes() {
        return [CardType.VICTORY];
    }
}
RegisterCard(ProvidenceCardDefinition);
class RemodelCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var trashOptions = GameDTOAccess.getCardsInZone(gameDTO, __this.cardState.ownerUUID, Zones.HAND);
            var conditionMap = {};
            trashOptions.forEach((value) => {
                var options = [];
                var trashedValue = GameDTOAccess.getCardDefinition(gameDTO, value).getCost();
                GameDTOAccess.getAvailableCardTypesInSupply(gameDTO).forEach((eachCardTypeInSupply) => {
                    var eachCard = GameDTOAccess.getNextCardInSupplyPile(gameDTO, eachCardTypeInSupply);
                    var definition = GameDTOAccess.getCardDefinition(gameDTO, eachCard);
                    if (definition.getCost() <= (trashedValue + 2)) {
                        options.push(definition.cardState.uuid);
                    }
                });
                conditionMap[value] = [];
                conditionMap[value].push(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(options), _.Exactly(_.Value(1)), "gained_card", "Choose a card to gain."));
                conditionMap[value].push(new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(__this.cardState.ownerUUID), _.Reference("gained_card"))));
            });
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(trashOptions), _.Exactly(_.Value(1)), "trashed_card", "Choose a card to trash."), new EventGeneratorStep(EventIds.TRASH_CARD, new TrashCardsEventArgs(_.Reference("trashed_card"))), new ConditionalStep(_.Reference("trashed_card"), conditionMap));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 4;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.REMODEL;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(RemodelCardDefinition);
///<reference path="../CardDefinition.ts" />
class SentryCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new DrawCardsStep(__this.cardState.ownerUUID, _.Value(1)), new EventGeneratorStep(EventIds.ADD_ACTION, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))));
            logicalBuffer.addSteps(new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(__this.cardState.ownerUUID), "deck_size"), new RelationalStep(_.Reference("deck_size"), RelationalOptions.EQUALS, _.Value(0), [
                new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(__this.cardState.ownerUUID)))
            ]), new LoadDeckInfoStep(LoadDeckInfoStepOptions.TOP_CARD, _.Value(__this.cardState.ownerUUID), "top_card"), new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Reference("top_card"))), new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(__this.cardState.ownerUUID), "deck_size"), new RelationalStep(_.Reference("deck_size"), RelationalOptions.EQUALS, _.Value(0), [
                new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(__this.cardState.ownerUUID)))
            ]), new LoadDeckInfoStep(new LoadDeckStepCardAtIndexFromTopOption(1), _.Value(__this.cardState.ownerUUID), "top_card_2"), new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Reference("top_card_2"))), new ArrayStep(ArrayStepOptions.ADD, _.Reference("top_card"), "cards_revealed"), new ArrayStep(ArrayStepOptions.ADD, _.Reference("top_card_2"), "cards_revealed"), new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Reference("cards_revealed"), _.UpTo(_.Value(2)), "chosen_cards_trash", "Choose card(s) to trash."), new QueryStep(_.Reference("chosen_cards_trash"), QueryStepOptions.NOT_IN, _.Reference("cards_revealed"), "chosen_cards_not_trashed"), new CountStep(_.Reference("chosen_cards_not_trashed"), "num_chosen_cards_not_trashed"), new RelationalStep(_.Reference("num_chosen_cards_not_trashed"), RelationalOptions.GREATER_THAN, _.Value(0), [
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
            ]), new ForEachStep(_.Reference("chosen_cards_trash"), "each_card_chosen", [
                new EventGeneratorStep(EventIds.TRASH_CARD, new TrashCardsEventArgs(_.Reference("each_card_chosen")))
            ]));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 5;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.SENTRY;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(SentryCardDefinition);
class SilverCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(2))));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 2;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.SILVER;
    }
    getCardTypes() {
        return [CardType.TREASURE];
    }
}
RegisterCard(SilverCardDefinition);
class SmithyCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new DrawCardsStep(__this.cardState.ownerUUID, _.Value(3)));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 4;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.SMITHY;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(SmithyCardDefinition);
class ThroneRoomCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var actionsInHand = GameDTOAccess.getCardsInZone(gameDTO, __this.cardState.ownerUUID, Zones.HAND).filter((value) => {
                return Util.contains(GameDTOAccess.getCardDefinition(gameDTO, value).getCardTypes(), CardType.ACTION);
            });
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            if (actionsInHand.length > 0) {
                logicalBuffer.addStep(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(actionsInHand), _.Exactly(_.Value(1)), "chosen_card", "Choose a card to play twice."));
                for (var i = 0; i < 2; i++) {
                    logicalBuffer.addStep(new EventGeneratorStep(EventIds.CARD_PLAYED, new CardPlayedEventArgs(_.Reference("chosen_card"))));
                }
            }
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 4;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.THRONE_ROOM;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(ThroneRoomCardDefinition);
class VassalCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps();
            var cardsOnDeck = GameDTOAccess.getCardsOnDeck(gameDTO, __this.cardState.ownerUUID, 1);
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(2))), new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(__this.cardState.ownerUUID), "deck_size"), new RelationalStep(_.Reference("deck_size"), RelationalOptions.EQUALS, _.Value(0), [
                new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(__this.cardState.ownerUUID)))
            ]), new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(__this.cardState.ownerUUID), "deck_size"), new RelationalStep(_.Reference("deck_size"), RelationalOptions.GREATER_THAN, _.Value(0), [
                new LoadDeckInfoStep(LoadDeckInfoStepOptions.TOP_CARD, _.Value(__this.cardState.ownerUUID), "top_card"),
                new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Reference("top_card"))),
                new LoadCardInfoStep(LoadCardInfoStepOptions.TYPES, _.Reference("top_card"), "card_revealed_types"),
                new ContainsStep(_.Value(CardType.ACTION), _.Reference("card_revealed_types"), [
                    new EventGeneratorStep(EventIds.CARD_PLAYED, new CardPlayedEventArgs(_.Reference("top_card")))
                ]),
                new ContainsStep(_.Value(CardType.ACTION), _.Reference("card_revealed_types"), [
                    new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("top_card")))
                ], ContainsStep.DOES_NOT_CONTAIN)
            ]));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 3;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.VASSAL;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(VassalCardDefinition);
class VillageCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new DrawCardsStep(__this.cardState.ownerUUID, _.Value(1)), new EventGeneratorStep(EventIds.ADD_ACTION, new AddActionEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(2))));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 3;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.VILLAGE;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(VillageCardDefinition);
class WitchCardDefinition extends CardDefinition {
    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(new DrawCardsStep(__this.cardState.ownerUUID, _.Value(2)));
            GameDTOAccess.getPlayers(gameDTO).forEach((value) => {
                if (value.uuid != __this.cardState.ownerUUID) {
                    if (!GameDTOAccess.isPlayerUnaffectedByCard(gameDTO, value.uuid, __this.cardState.uuid)) {
                        var nextCurse = GameDTOAccess.getNextCardInSupplyPile(gameDTO, CardIds.CURSE);
                        if (nextCurse != null) {
                            logicalBuffer.addSteps(new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(value.uuid), _.Value(nextCurse))));
                        }
                    }
                }
            });
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 5;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.WITCH;
    }
    getCardTypes() {
        return [CardType.ACTION, CardType.ATTACK];
    }
}
RegisterCard(WitchCardDefinition);
class WorkshopCardDefinition extends CardDefinition {
    setReactions() {
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
            logicalBuffer.addSteps(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(cardChoices), _.Exactly(_.Value(1)), GainCardEvent.CHOSEN_CARD, "Choose a card to gain."), new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(__this.cardState.ownerUUID), _.Reference(GainCardEvent.CHOSEN_CARD))));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }
    getCost() {
        return 4;
    }
    getVictoryPoints(gameDTO) {
        return 0;
    }
    getCardId() {
        return CardIds.WORKSHOP;
    }
    getCardTypes() {
        return [CardType.ACTION];
    }
}
RegisterCard(WorkshopCardDefinition);
class AIPlayer {
    constructor(gameDTO, playerUUIDMappedTo) {
        var __this = this;
        this.gameDTO = gameDTO;
        this.uuid = UUID();
        this.playerUUIDMappedTo = playerUUIDMappedTo;
        var lu = new LoggingUtils(gameDTO);
        TurnNotify.subscribe((turnPlayer) => {
            if (turnPlayer == this.playerUUIDMappedTo) {
                if (GlobalAIConfig.AUTORUN) {
                    this.doTurn(gameDTO);
                }
                else {
                    Log.send(this.uuid + ": Press A to advance " + lu.fname(this.playerUUIDMappedTo) + "'s turn.");
                    var thisCallbackTwo = (event) => {
                        if (event.key == "a") {
                            window.removeEventListener('keydown', thisCallbackTwo);
                            this.doTurn(gameDTO);
                        }
                    };
                    window.addEventListener('keydown', thisCallbackTwo);
                }
            }
        });
        PlayerChoiceNotify.subscribe((playerUUID, options, prepositionType, prepositionValue) => {
            if (__this.playerUUIDMappedTo == playerUUID) {
                GameDTOAccess.setPlayerChoice(gameDTO, this.makePlayerChoice(options, prepositionType, prepositionValue));
            }
        });
    }
    doTurn(gameDTO) {
        var __this = this;
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.fname(this.playerUUIDMappedTo) + " is thinking...");
        setTimeout(function () {
            var moves = new PossibleMovesGenerator().generate(__this.playerUUIDMappedTo, gameDTO);
            if (moves.length > 0) {
                if (GlobalAIConfig.AUTORUN) {
                    Util.shuffle(moves);
                    moves[0].execute(gameDTO);
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
                    DriverNotify.ping();
                }
                else {
                    MessagingCenter.notify("move_display", { moves: moves, gameDto: gameDTO });
                }
            }
        }, 500);
    }
    makePlayerChoice(options, prepositionType, prepositionValue) {
        var numberToPick = null;
        if (prepositionType == PlayerChoicePrepositionValues.EXACTLY) {
            numberToPick = prepositionValue;
        }
        else {
            numberToPick = Util.randomInRange(0, prepositionValue);
        }
        var choices = [];
        var shuffledOptions = Util.shuffle(options);
        for (var i = 0; i < numberToPick; i++) {
            choices.push(shuffledOptions[i]);
        }
        return choices;
    }
}
class ChosenMoveReceiver {
    receive(move, gameDTO) {
        this.process(move, gameDTO);
    }
    validate() {
    }
    process(move, gameDTO) {
        move.execute(gameDTO);
        GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
    }
}
class GlobalAIConfig {
}
GlobalAIConfig.AUTORUN = false;
class PossibleMovesGenerator {
    generate(playerUUID, gameDTO) {
        var result = [];
        if (playerUUID == gameDTO.state.turnPlayer) {
            if (gameDTO.state.state == GameState.WAITING_FOR_PLAYER_CHOICE) {
                var _ = new LogicalUtils();
                var stack = GameDTOAccess.getLogicalStack(gameDTO);
                var topBuffer = stack.buffers[stack.buffers.length - 1];
                var currentStep = GameDTOAccess.traverseLogicalStep(gameDTO, topBuffer, topBuffer.getCurrentStep());
                if (currentStep instanceof PlayerChoiceStep) {
                    var optionsResolved = _.ResolveVariable(currentStep.options, topBuffer);
                    var maxChoicesNum;
                    var minChoicesNum;
                    if (currentStep.preposition.type == PlayerChoicePrepositionValues.EXACTLY) {
                        maxChoicesNum = _.ResolveVariable(currentStep.preposition.value, topBuffer);
                        minChoicesNum = _.ResolveVariable(currentStep.preposition.value, topBuffer);
                    }
                    else {
                        minChoicesNum = 0;
                        maxChoicesNum = _.ResolveVariable(currentStep.preposition.value, topBuffer);
                    }
                    result.push(currentStep.choiceType, new ChoiceMove([], optionsResolved, minChoicesNum, maxChoicesNum, currentStep.displayText));
                }
            }
            else if (gameDTO.state.state == GameState.TURN_WAITING) {
                var playerDTO = GameDTOAccess.getPlayerFromUUID(gameDTO, playerUUID);
                GameDTOAccess.getCardsInZone(gameDTO, playerUUID, Zones.HAND).forEach((eachCardInHand) => {
                    var definition = GameDTOAccess.getCardDefinition(gameDTO, eachCardInHand);
                    if (definition.canPlay(gameDTO)) {
                        result.push(new PlayMove(eachCardInHand));
                    }
                });
                if (gameDTO.state.phase == Phase.BUY && playerDTO.turn.buys > 0) {
                    GameDTOAccess.getAvailableCardTypesInSupply(gameDTO).forEach((eachType) => {
                        if (eachType != CardIds.COPPER) {
                            var topCard = GameDTOAccess.getNextCardInSupplyPile(gameDTO, eachType);
                            var definition = GameDTOAccess.getCardDefinition(gameDTO, topCard);
                            var cost = definition.getCost();
                            if (playerDTO.turn.money >= cost) {
                                result.push(new BuyMove(playerDTO.uuid, topCard));
                            }
                        }
                    });
                }
                result.push(new AdvancePhaseMove());
            }
        }
        return result;
    }
}
var MoveType;
(function (MoveType) {
    MoveType[MoveType["PLAY"] = 0] = "PLAY";
    MoveType[MoveType["BUY"] = 1] = "BUY";
    MoveType[MoveType["ADVANCE_PHASE"] = 2] = "ADVANCE_PHASE";
    MoveType[MoveType["CHOICE"] = 3] = "CHOICE";
})(MoveType || (MoveType = {}));
///<reference path="MoveType.ts" />
class Move {
    static fromJson(json) {
        var moveType = json["moveType"];
        var newInstance = Move.create(moveType);
        for (var key in json) {
            newInstance[key] = json[key];
        }
        return newInstance;
    }
    static toJsonObject(moveObject, gameDTO) {
        var instance = {};
        for (var key in moveObject) {
            instance[key] = moveObject[key];
        }
        instance["moveType"] = moveObject.getMoveType();
        return instance;
    }
    static registerMoveGenerator(id, generator) {
        Move.MOVE_GENERATORS[id] = generator;
    }
    static create(moveType) {
        return Move.MOVE_GENERATORS[moveType]();
    }
    configureGenerator() {
        var _this = this;
        Move.registerMoveGenerator(this.getMoveType(), () => {
            var instance = new _this.constructor();
            return instance;
        });
    }
}
Move.MOVE_GENERATORS = {};
function RegisterMove(moveType) {
    new moveType().configureGenerator();
}
///<reference path="Move.ts" />
class AdvancePhaseMove extends Move {
    execute(gameDTO) {
        var playEvent = GameEvent.create(EventIds.ADVANCE_PHASE, {});
        GameDTOAccess.pushEventToStack(gameDTO, playEvent);
        GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
    }
    getMoveType() {
        return MoveType.ADVANCE_PHASE;
    }
}
RegisterMove(AdvancePhaseMove);
///<reference path="Move.ts" />
class BuyMove extends Move {
    constructor(playerToGain, cardToBuy) {
        super();
        this.cardToBuy = cardToBuy;
        this.playerToGain = playerToGain;
    }
    execute(gameDTO) {
        var _ = new LogicalUtils();
        var args = {};
        args[GainCardEvent.CHOSEN_CARD] = this.cardToBuy;
        args[GainCardEvent.RECIPIENT] = this.playerToGain;
        var playEvent = GameEvent.create(EventIds.GAIN_CARD, args);
        GameDTOAccess.pushEventToStack(gameDTO, playEvent);
        var buyArgs = {};
        buyArgs[AddBuysEvent.AMOUNT] = -1;
        buyArgs[AddBuysEvent.PLAYER_UUID] = this.playerToGain;
        var buyEvent = GameEvent.create(EventIds.ADD_BUYS, buyArgs);
        GameDTOAccess.pushEventToStack(gameDTO, buyEvent);
        GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
    }
    getMoveType() {
        return MoveType.BUY;
    }
    toString(gameDTO) {
        var lu = new LoggingUtils(gameDTO);
        return "Buy " + lu.fname(this.cardToBuy);
    }
}
RegisterMove(BuyMove);
///<reference path="Move.ts" />
class ChoiceMove extends Move {
    constructor(choiceType, choices, options, minChoicesNum, maxChoicesNum, choiceString) {
        super();
        this.choiceType = choiceType;
        this.choices = choices;
        this.options = options;
        this.minChoicesNum = minChoicesNum;
        this.maxChoicesNum = maxChoicesNum;
        this.choiceString = choiceString;
    }
    execute(gameDTO) {
        var stack = GameDTOAccess.getLogicalStack(gameDTO);
        var topBuffer = stack.buffers[stack.buffers.length - 1];
        var currentStep = GameDTOAccess.traverseLogicalStep(gameDTO, topBuffer, topBuffer.getCurrentStep());
        if (currentStep instanceof PlayerChoiceStep) {
            currentStep.fulfill(this.choices, topBuffer, gameDTO);
            GameDTOAccess.setState(gameDTO, GameState.RESOLVING_LOGICAL_STACK);
        }
    }
    getMoveType() {
        return MoveType.CHOICE;
    }
}
RegisterMove(ChoiceMove);
class PlayMove extends Move {
    constructor(cardToPlay) {
        super();
        this.cardToPlay = cardToPlay;
    }
    execute(gameDTO) {
        var _ = new LogicalUtils();
        var args = {};
        args[CardPlayedEvent.CARD_UUID] = this.cardToPlay;
        var playEvent = GameEvent.create(EventIds.CARD_PLAYED, args);
        GameDTOAccess.pushEventToStack(gameDTO, playEvent);
        GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
    }
    getMoveType() {
        return MoveType.PLAY;
    }
    toString(gameDTO) {
        var lu = new LoggingUtils(gameDTO);
        return "Play " + lu.fname(this.cardToPlay);
    }
}
RegisterMove(PlayMove);
var Phase;
(function (Phase) {
    Phase[Phase["ACTION"] = 0] = "ACTION";
    Phase[Phase["BUY"] = 1] = "BUY";
    Phase[Phase["CLEAN_UP"] = 2] = "CLEAN_UP";
})(Phase || (Phase = {}));
var Zones;
(function (Zones) {
    Zones[Zones["SUPPLY"] = 0] = "SUPPLY";
    Zones[Zones["DECK"] = 1] = "DECK";
    Zones[Zones["HAND"] = 2] = "HAND";
    Zones[Zones["IN_PLAY"] = 3] = "IN_PLAY";
    Zones[Zones["DISCARD_PILE"] = 4] = "DISCARD_PILE";
    Zones[Zones["TRASH"] = 5] = "TRASH";
    Zones[Zones["REVEALED"] = 6] = "REVEALED";
})(Zones || (Zones = {}));
class DTO {
}
///<reference path="./DTO.ts" />
class GameDTO extends DTO {
    constructor() {
        super(...arguments);
        this.players = [];
        this.cards = [];
        this.engine = new GameDTO_Engine();
        this.state = new GameDTO_State();
    }
}
class GameDTO_Engine extends DTO {
    constructor() {
        super(...arguments);
        this.logicalStack = [];
        this.reactionStack = [];
        this.eventStack = [];
    }
}
class GameDTO_Player extends DTO {
    constructor() {
        super(...arguments);
        this.turn = new GameDTO_Player_Turn();
    }
}
class GameDTO_Player_Turn extends DTO {
    constructor() {
        super(...arguments);
        this.money = 0;
        this.actions = 0;
        this.buys = 0;
    }
}
class GameDTO_Card extends DTO {
}
class GameDTO_LogicalBuffer extends DTO {
    constructor() {
        super(...arguments);
        this.storedData = {};
    }
}
class GameDTO_LogicalBuffer_Step extends DTO {
}
class GameDTO_LogicalBufferVariable extends DTO {
}
class GameDTO_EventEntry extends DTO {
}
class GameDTO_State extends DTO {
    constructor() {
        super(...arguments);
        this.state = GameState.NOT_STARTED;
        this.phase = Phase.ACTION;
        this.unaffectedPlayers = [];
    }
}
class GameDTO_ReactionBuffer extends DTO {
    constructor() {
        super(...arguments);
        this.potentialReactions = [];
    }
}
class GameDTOAccess {
    static setPlayerChoice(gameDTO, chosenOptions) {
        var stack = GameDTOAccess.getLogicalStack(gameDTO);
        var topBuffer = stack.buffers[stack.buffers.length - 1];
        var currentStep = GameDTOAccess.traverseLogicalStep(gameDTO, topBuffer, topBuffer.getCurrentStep());
        if (currentStep instanceof PlayerChoiceStep) {
            currentStep.fulfill(chosenOptions, topBuffer, gameDTO);
        }
    }
    static traverseLogicalStep(gameDTO, currentBuffer, currentStep) {
        if (!currentStep.hasSubsteps()) {
            return currentStep;
        }
        else {
            return GameDTOAccess.traverseLogicalStep(gameDTO, currentBuffer, currentStep.getCurrentSubstep(currentBuffer, gameDTO));
        }
    }
    static changeTurns(gameDTO) {
        var nextPlayer = null;
        gameDTO.players.forEach((value) => {
            if (value.uuid != gameDTO.state.turnPlayer) {
                nextPlayer = value;
            }
        });
        gameDTO.state.turnPlayer = nextPlayer.uuid;
        nextPlayer.turn.buys = 1;
        nextPlayer.turn.actions = 1;
        var lu = new LoggingUtils(gameDTO);
        Log.send("It is now " + lu.fname(gameDTO.state.turnPlayer) + "'s turn.");
    }
    static removeTopReactionBuffer(gameDTO) {
        gameDTO.engine.reactionStack.splice(gameDTO.engine.reactionStack.indexOf(gameDTO.engine.reactionStack[gameDTO.engine.reactionStack.length - 1]), 1);
    }
    static removeLogicalBuffer(gameDTO, bufferToRemove) {
        var dtoIdx = null;
        gameDTO.engine.logicalStack.forEach((buffer, index) => {
            if (buffer.uuid == bufferToRemove.uuid) {
                dtoIdx = index;
            }
        });
        gameDTO.engine.logicalStack.splice(dtoIdx, 1);
    }
    static removeEvent(gameDTO, eventToRemove) {
        var dtoIdx = null;
        gameDTO.engine.eventStack.forEach((event, index) => {
            if (event.eventUUID == eventToRemove.uuid) {
                dtoIdx = index;
            }
        });
        gameDTO.engine.eventStack.splice(dtoIdx, 1);
    }
    static updateEvent(gameDTO, updatingEvent) {
        //Log.send("EventStack before: " + JSON.stringify(gameDTO.engine.eventStack));
        var indexToUpdate = -1;
        gameDTO.engine.eventStack.forEach((event, index) => {
            if (event.eventUUID == updatingEvent.uuid) {
                indexToUpdate = index;
            }
        });
        if (indexToUpdate > -1) {
            gameDTO.engine.eventStack[indexToUpdate] = updatingEvent.convertToDTO();
        }
        //Log.send("EventStack after: " + JSON.stringify(gameDTO.engine.eventStack));
    }
    static pushNewReactionBuffer(gameDTO, newReactionBuffer) {
        var dto = newReactionBuffer.convertToDTO();
        gameDTO.engine.reactionStack.push(dto);
    }
    static getReactionStack(gameDTO) {
        var stack = new ReactionStack();
        stack.buffers = [];
        gameDTO.engine.reactionStack.forEach((value) => {
            var eventStatus = GameDTOAccess.getEvent(gameDTO, value.eventUUIDReactingTo).status;
            stack.buffers.push(new ReactionBuffer(value.eventUUIDReactingTo, eventStatus, value.potentialReactions));
        });
        return stack;
    }
    static getEventStack(gameDTO) {
        var stack = new EventStack();
        stack.events = [];
        gameDTO.engine.eventStack.forEach((value) => {
            stack.events.push(GameEvent.createFromDTO(value));
        });
        return stack;
    }
    static getLogicalStack(gameDTO) {
        var stack = new LogicalStack();
        stack.buffers = [];
        gameDTO.engine.logicalStack.forEach((value) => {
            stack.buffers.push(LogicalBuffer.createFromDTO(value, gameDTO));
        });
        return stack;
    }
    static getEvent(gameDTO, eventUUID) {
        var result = null;
        gameDTO.engine.eventStack.forEach((event) => {
            if (event.eventUUID == eventUUID) {
                result = GameEvent.createWithStatus(event.eventId, event.status, event.args);
            }
        });
        return result;
    }
    static getTopEvent(gameDTO) {
        var topDTO = gameDTO.engine.eventStack[gameDTO.engine.eventStack.length];
        return GameEvent.createWithStatus(topDTO.eventId, topDTO.status, topDTO.args);
    }
    static updateLogicalBuffer(gameDTO, logicalBuffer) {
        var dto = logicalBuffer.convertToDTO(gameDTO);
        var indexToUpdate = 0;
        gameDTO.engine.logicalStack.forEach((value, index) => {
            if (value.uuid == logicalBuffer.uuid) {
                indexToUpdate = index;
            }
        });
        gameDTO.engine.logicalStack[indexToUpdate] = dto;
    }
    static getTopLogicalBuffer(gameDTO) {
        return LogicalBuffer.createFromDTO(gameDTO.engine.logicalStack[gameDTO.engine.logicalStack.length - 1], gameDTO);
    }
    static isEventStackCleared(gameDTO) {
        return gameDTO.engine.eventStack.length <= 0;
    }
    static isLogicalStackCleared(gameDTO) {
        return gameDTO.engine.logicalStack.length <= 0;
    }
    static isReactionStackCleared(gameDTO) {
        return gameDTO.engine.reactionStack.length <= 0;
    }
    static rebalanceZone(gameDTO, playerUUID, zoneId) {
        if (zoneId != Zones.SUPPLY) {
            var zoneCards = GameDTOAccess.getCardDTOsInZone(gameDTO, playerUUID, zoneId);
            zoneCards.forEach((value, index) => {
                value.zoneIndex = index;
            });
        }
    }
    static isGameOver(gameDTO) {
        return false;
    }
    static getObjectForUUID(gameDTO, uuid) {
        var result = null;
        gameDTO.cards.forEach((eachCard) => {
            if (eachCard.uuid == uuid) {
                result = eachCard;
            }
        });
        if (result == null) {
            gameDTO.players.forEach((eachPlayer) => {
                if (eachPlayer.uuid == uuid) {
                    result = eachPlayer;
                }
            });
        }
        return result;
    }
    static setState(gameDTO, state) {
        gameDTO.state.state = state;
        //Log.send("Game state is now " + GameState[state]);
    }
    static setTurn(gameDTO, turnPlayerUUID) {
        var lu = new LoggingUtils(gameDTO);
        gameDTO.state.turnPlayer = turnPlayerUUID;
        GameDTOAccess.setState(gameDTO, GameState.TURN_WAITING);
        //  Log.send("It is now " + lu.fname(turnPlayerUUID) + "'s turn.");
        // TurnNotify.send(turnPlayerUUID);
    }
    static removePlayerUnaffectedByEffect(gameDTO, recipient, cardProtectedFrom) {
        var indexToRemove = null;
        gameDTO.state.unaffectedPlayers.forEach((value, index) => {
            if (value["playerUUID"] && value["cardProtectedFrom"]) {
                indexToRemove = index;
            }
        });
        gameDTO.state.unaffectedPlayers.splice(indexToRemove, 1);
    }
    static setPlayerUnaffectedByEffect(gameDTO, recipient, cardProtectedFrom) {
        var unaffectedEntry = {};
        unaffectedEntry["playerUUID"] = recipient;
        unaffectedEntry["cardProtectedFrom"] = cardProtectedFrom;
        gameDTO.state.unaffectedPlayers.push(unaffectedEntry);
    }
    static shuffleDeck(gameDTO, recipient) {
        var deck = GameDTOAccess.getCardDTOsInZone(gameDTO, recipient, Zones.DECK);
        var indexes = new Array(deck.length);
        for (var i = 0; i < indexes.length; i++) {
            indexes[i] = i;
        }
        Util.shuffle(indexes);
        indexes.forEach((value, index) => {
            deck[index].zoneIndex = value;
        });
        gameDTO.cards.sort(function (a, b) {
            return a.zoneIndex - b.zoneIndex;
        });
    }
    static getCardDTOsInZone(gameDTO, recipient, zone) {
        var result = [];
        gameDTO.cards.forEach((value) => {
            if (value.ownerUUID == recipient && value.zoneId == zone) {
                result.push(value);
            }
        });
        return result;
    }
    static setDeckIndex(gameDTO, cardUUID, newIndex) {
        var owner = GameDTOAccess.getOwner(gameDTO, cardUUID);
        var deck = GameDTOAccess.getCardDTOsInZone(gameDTO, owner, Zones.DECK);
        deck.forEach((value) => {
            if (value.zoneIndex >= newIndex) {
                value.zoneIndex = value.zoneIndex + 1;
            }
        });
        var dto = GameDTOAccess.getCardDTO(gameDTO, cardUUID);
        dto.zoneIndex = newIndex;
    }
    static getAllCardsOwnedBy(gameDTO, ownerUUID) {
        var result = [];
        gameDTO.cards.forEach((value) => {
            if (value.ownerUUID == ownerUUID) {
                result.push(value.uuid);
            }
        });
        return result;
    }
    static countEmptySupplyPiles(gameDTO) {
        var cardTypes = [];
        gameDTO.cards.forEach((value) => {
            if (value.zoneId == Zones.SUPPLY) {
                var type = value.definitionId;
                if (cardTypes.indexOf(type) == -1) {
                    cardTypes.push(type);
                }
            }
        });
        return 17 - cardTypes.length;
    }
    static getCardsInZone(gameDTO, ownerUUID, zone) {
        var result = [];
        gameDTO.cards.forEach((value) => {
            if (value.ownerUUID == ownerUUID && value.zoneId == zone) {
                result.push(value.uuid);
            }
        });
        return result;
    }
    static pushEventsToStack(gameDTO, arg1) {
        throw new Error("Method not implemented.");
    }
    static getVictoriesInHand(gameDTO, uuid) {
        var results = [];
        var cardsInHand = GameDTOAccess.getCardsInZone(gameDTO, uuid, Zones.HAND);
        cardsInHand.forEach((value) => {
            var definition = GameDTOAccess.getCardDefinition(gameDTO, value);
            if (Util.contains(definition.getCardTypes(), CardType.VICTORY)) {
                results.push(value);
            }
        });
        return results;
    }
    static isPlayerUnaffectedByCard(gameDTO, playerUUID, cardUUID) {
        var result = false;
        gameDTO.state.unaffectedPlayers.forEach((value, index) => {
            if (value["playerUUID"] && value["cardProtectedFrom"]) {
                result = true;
            }
        });
        return result;
    }
    static getNextCardInSupplyPile(gameDTO, cardId) {
        var result = null;
        var maxIndex = 0;
        gameDTO.cards.forEach((value) => {
            if (value.zoneId == Zones.SUPPLY && value.definitionId == cardId) {
                if (maxIndex <= value.zoneIndex) {
                    maxIndex = value.zoneIndex;
                    result = value.uuid;
                }
            }
        });
        return result;
    }
    static getCardsInPile(gameDTO, cardId) {
        var result = [];
        gameDTO.cards.forEach((value) => {
            if (value.definitionId == cardId && value.zoneId == Zones.SUPPLY) {
                result.push(value.uuid);
            }
        });
        return result;
    }
    static getCardsOnDeck(gameDTO, ownerUUID, numberToGet) {
        GameDTOAccess.rebalanceZone(gameDTO, ownerUUID, Zones.DECK);
        var deck = GameDTOAccess.getCardDTOsInZone(gameDTO, ownerUUID, Zones.DECK);
        var result = [];
        var indexesToGet = [];
        for (var i = 0; i < numberToGet; i++) {
            indexesToGet.push(deck.length - (i + 1));
        }
        deck.forEach((value) => {
            if (Util.contains(indexesToGet, value.zoneIndex)) {
                result.push(value.uuid);
            }
        });
        return result;
    }
    static getCardDefinition(gameDTO, cardUUID) {
        var dto = GameDTOAccess.getCardDTO(gameDTO, cardUUID);
        var state = new CardState(dto.uuid, dto.zoneId, dto.ownerUUID);
        var definition = CardDefinition.create(dto.definitionId, state);
        return definition;
    }
    static getCardDTO(gameDTO, uuid) {
        var result = null;
        gameDTO.cards.forEach((value) => {
            if (value.uuid == uuid) {
                result = value;
            }
        });
        return result;
    }
    static getOwner(gameDTO, uuid) {
        var dto = GameDTOAccess.getCardDTO(gameDTO, uuid);
        return dto.ownerUUID;
    }
    static getOwnerDTO(gameDTO, uuid) {
        var dto = GameDTOAccess.getCardDTO(gameDTO, uuid);
        var result = null;
        gameDTO.players.forEach((eachPlayer) => {
            if (eachPlayer.uuid == dto.ownerUUID) {
                result = eachPlayer;
            }
        });
        return result;
    }
    static getPlayers(gameDTO) {
        return gameDTO.players;
    }
    static getTopCardOfDeck(gameDTO, recipient) {
        return GameDTOAccess.getCardsOnDeck(gameDTO, recipient, 1)[0];
    }
    static setOwner(gameDTO, chosenCard, recipient) {
        var dto = GameDTOAccess.getCardDTO(gameDTO, chosenCard);
        dto.ownerUUID = recipient;
    }
    static pushNewLogicalBuffer(gameDTO, buffer) {
        var logicalBuffer = buffer.convertToDTO(gameDTO);
        gameDTO.engine.logicalStack.push(logicalBuffer);
        GameDTOAccess.setState(gameDTO, GameState.RESOLVING_LOGICAL_STACK);
        ReactionStack.currentOutput.createdLogicalOutput = true;
    }
    static setZone(gameDTO, cardUUID, zoneId) {
        var cardDTO = GameDTOAccess.getCardFromUUID(gameDTO, cardUUID);
        var oldZone = cardDTO.zoneId;
        cardDTO.zoneId = zoneId;
        GameDTOAccess.rebalanceZone(gameDTO, cardUUID, zoneId);
        GameDTOAccess.rebalanceZone(gameDTO, cardUUID, oldZone);
    }
    static pushEventToStack(gameDTO, event) {
        var dto = event.convertToDTO();
        dto.eventUUID = UUID();
        gameDTO.engine.eventStack.push(dto);
    }
    static getCardFromUUID(game, cardUuid) {
        return game.cards.filter((value) => {
            return value.uuid == cardUuid;
        })[0];
    }
    static getPlayerFromUUID(game, playerUUID) {
        return game.players.filter((value) => {
            return value.uuid == playerUUID;
        })[0];
    }
    static getPlayerUUIDs_asStringArray(game) {
        return game.players.map((value) => {
            return value.uuid + "";
        });
    }
    static getAvailableCardTypesInSupply(gameDTO) {
        var result = [];
        gameDTO.cards.forEach((value) => {
            if (value.zoneId == Zones.SUPPLY) {
                if (result.indexOf(value.definitionId) == -1) {
                    result.push(value.definitionId);
                }
            }
        });
        return result;
    }
}
class GameDTOTransform {
    static createFromJSON(json) {
        var jsonObj = JSON.parse(json);
        var gameDTO = new GameDTO();
        var players = [];
        jsonObj["players"].forEach((eachPlayer) => {
            var player = GameDTOTransform.obj2Instance(eachPlayer, GameDTO_Player);
            var turn = GameDTOTransform.obj2Instance(eachPlayer["turn"], GameDTO_Player_Turn);
            player.turn = turn;
            players.push(player);
        });
        var cards = [];
        jsonObj["cards"].forEach((eachCard) => {
            cards.push(GameDTOTransform.obj2Instance(eachCard, GameDTO_Card));
        });
        var engine = new GameDTO_Engine();
        var logicalStack = [];
        jsonObj["engine"]["logicalStack"].forEach((eachLogicalBuffer) => {
            var buffer = GameDTOTransform.obj2Instance(eachLogicalBuffer, GameDTO_LogicalBuffer);
            var steps = [];
            eachLogicalBuffer["steps"].forEach((eachStep) => {
                steps.push(GameDTOTransform.obj2Instance(eachStep, GameDTO_LogicalBuffer_Step));
            });
            buffer.steps = steps;
            logicalStack.push(buffer);
        });
        var reactionStack = [];
        jsonObj["engine"]["reactionStack"].forEach((eachReactionBuffer) => {
            var buffer = GameDTOTransform.obj2Instance(eachReactionBuffer, GameDTO_ReactionBuffer);
            var potentialReactions = [];
            eachReactionBuffer["potentialReactions"].forEach((eachPotentialReaction) => {
                potentialReactions.push(GameDTOTransform.obj2Instance(eachPotentialReaction, ReactionKey));
            });
            buffer.potentialReactions = potentialReactions;
            reactionStack.push(buffer);
        });
        var eventStack = [];
        jsonObj["engine"]["eventStack"].forEach((eachEventEntry) => {
            eventStack.push(GameDTOTransform.obj2Instance(eachEventEntry, GameDTO_EventEntry));
        });
        engine.eventStack = eventStack;
        engine.reactionStack = reactionStack;
        engine.logicalStack = logicalStack;
        var state = GameDTOTransform.obj2Instance(jsonObj["state"], GameDTO_State);
        gameDTO.players = players;
        gameDTO.cards = cards;
        gameDTO.engine = engine;
        gameDTO.state = state;
        return gameDTO;
    }
    static obj2Instance(object, type) {
        var instance = new type();
        for (var key in object) {
            instance[key] = object[key];
        }
        return instance;
    }
}
class EngineSource {
}
var EngineSourceType;
(function (EngineSourceType) {
    EngineSourceType[EngineSourceType["LOGICAL"] = 0] = "LOGICAL";
    EngineSourceType[EngineSourceType["REACTION"] = 1] = "REACTION";
    EngineSourceType[EngineSourceType["EVENT"] = 2] = "EVENT";
    EngineSourceType[EngineSourceType["USER"] = 3] = "USER";
})(EngineSourceType || (EngineSourceType = {}));
class GameDriver {
    constructor(gameDTO) {
        this.waiting = false;
        if (gameDTO != null) {
            this.gameDTO = gameDTO;
        }
        else {
            this.gameDTO = new GameDTO();
        }
        var __this = this;
        DriverNotify.subscribe((message) => {
            __this.process();
        });
    }
    process() {
        var shouldContinue = true;
        while (shouldContinue) {
            shouldContinue = this.step();
        }
    }
    step() {
        var continueStep = false;
        var gameState = this.gameDTO.state.state;
        var gameDTO = this.gameDTO;
        ;
        if (gameState == GameState.START) {
            GamePopulator.populate(gameDTO);
            GamePopulator.setFirstTurn(gameDTO);
        }
        if (GameDTOAccess.isGameOver(gameDTO)) {
            GameDTOAccess.setState(gameDTO, GameState.END);
        }
        else if (GameDTOAccess.isLogicalStackCleared(gameDTO) &&
            GameDTOAccess.isEventStackCleared(gameDTO) &&
            GameDTOAccess.isReactionStackCleared(gameDTO)) {
            GameDTOAccess.setState(gameDTO, GameState.TURN_WAITING);
        }
        if (gameState == GameState.RESOLVING_LOGICAL_STACK) {
            if (!GameDTOAccess.isLogicalStackCleared(gameDTO)) {
                var logicalStack = GameDTOAccess.getLogicalStack(gameDTO);
                var output = logicalStack.processAndAdvance(gameDTO);
                if (output.eventsGenerated) {
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
                }
                else if (output.isCurrentBufferComplete) {
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_REACTION_STACK);
                }
            }
            else {
                GameDTOAccess.setState(gameDTO, GameState.RESOLVING_REACTION_STACK);
            }
            continueStep = true;
        }
        else if (gameState == GameState.RESOLVING_EVENT_STACK) {
            if (!GameDTOAccess.isEventStackCleared(gameDTO)) {
                var eventStack = GameDTOAccess.getEventStack(gameDTO);
                var eventStackOutput = eventStack.processAndAdvance(gameDTO);
                if (eventStackOutput.reactionsGenerated) {
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_REACTION_STACK);
                }
                else if (eventStackOutput.isCurrentBufferComplete) {
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_LOGICAL_STACK);
                }
            }
            else {
                GameDTOAccess.setState(gameDTO, GameState.RESOLVING_LOGICAL_STACK);
            }
            continueStep = true;
        }
        else if (gameState == GameState.RESOLVING_REACTION_STACK) {
            if (!GameDTOAccess.isReactionStackCleared(gameDTO)) {
                var reactionStack = GameDTOAccess.getReactionStack(gameDTO);
                var reactionStackOutput = reactionStack.processAndAdvance(gameDTO);
                if (reactionStackOutput.createdLogicalOutput) {
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_LOGICAL_STACK);
                }
                else if (reactionStackOutput.currentBufferFinished) {
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
                }
            }
            else {
                GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
            }
            continueStep = true;
        }
        if (gameState == GameState.TURN_WAITING || gameState == GameState.WAITING_FOR_PLAYER_CHOICE) {
            continueStep = false;
        }
        return continueStep;
    }
}
var GameState;
(function (GameState) {
    GameState[GameState["NOT_STARTED"] = 0] = "NOT_STARTED";
    GameState[GameState["START"] = 1] = "START";
    GameState[GameState["TURN_WAITING"] = 2] = "TURN_WAITING";
    GameState[GameState["RESOLVING_LOGICAL_STACK"] = 3] = "RESOLVING_LOGICAL_STACK";
    GameState[GameState["RESOLVING_REACTION_STACK"] = 4] = "RESOLVING_REACTION_STACK";
    GameState[GameState["RESOLVING_EVENT_STACK"] = 5] = "RESOLVING_EVENT_STACK";
    GameState[GameState["WAITING_FOR_PLAYER_CHOICE"] = 6] = "WAITING_FOR_PLAYER_CHOICE";
    GameState[GameState["END"] = 7] = "END";
})(GameState || (GameState = {}));
class GamePopulator {
    static populate(gameDTO) {
        GamePopulator.populateCards(gameDTO);
        // GamePopulator.populateUsers(gameDTO);
        GamePopulator.openingDecks(gameDTO);
        GamePopulator.openingDraws(gameDTO);
    }
    static setFirstTurn(gameDTO) {
        Util.shuffle(gameDTO.players);
        GameDTOAccess.setTurn(gameDTO, gameDTO.players[0].uuid);
    }
    static populateCards(gameDTO) {
        var chosenKingdomCards = Util.shuffle(GamePopulator.kingdomCards).slice(0, 10);
        chosenKingdomCards.forEach((value) => {
            for (var i = 0; i < 10; i++) {
                var dto = GamePopulator.createNewCardDTO(gameDTO, value, "NONE");
                gameDTO.cards.push(dto);
            }
        });
        GamePopulator.otherSupplyCards.forEach((value) => {
            var cardId = value[0];
            var numToCreate = value[1];
            for (var i = 0; i < numToCreate; i++) {
                var dto = GamePopulator.createNewCardDTO(gameDTO, cardId, "NONE");
                gameDTO.cards.push(dto);
            }
        });
    }
    static populateUsers(gameDTO) {
        var player1 = new GameDTO_Player();
        player1.uuid = UUID();
        player1.name = "Adam";
        var player2 = new GameDTO_Player();
        player2.name = "Eve";
        player2.uuid = UUID();
        gameDTO.players.push(player1);
        gameDTO.players.push(player2);
    }
    static openingDecks(gameDTO) {
        var _ = new LogicalUtils();
        gameDTO.players.forEach((eachPlayer) => {
            for (var i = 0; i < 7; i++) {
                var nextCopper = GameDTOAccess.getNextCardInSupplyPile(gameDTO, CardIds.COPPER);
                GameDTOAccess.setOwner(gameDTO, nextCopper, eachPlayer.uuid);
                GameDTOAccess.setZone(gameDTO, nextCopper, Zones.DECK);
                Log.send(eachPlayer.name + " gained a COPPER");
            }
            for (var i = 0; i < 3; i++) {
                var nextEstate = GameDTOAccess.getNextCardInSupplyPile(gameDTO, CardIds.ESTATE);
                GameDTOAccess.setOwner(gameDTO, nextEstate, eachPlayer.uuid);
                GameDTOAccess.setZone(gameDTO, nextEstate, Zones.DECK);
                Log.send(eachPlayer.name + " gained an ESTATE");
            }
            GameDTOAccess.shuffleDeck(gameDTO, eachPlayer.uuid);
        });
    }
    static openingDraws(gameDTO) {
        var _ = new LogicalUtils();
        var lu = new LoggingUtils(gameDTO);
        gameDTO.players.forEach((eachPlayer) => {
            for (var i = 0; i < 5; i++) {
                var cardUUID = GameDTOAccess.getTopCardOfDeck(gameDTO, eachPlayer.uuid);
                GameDTOAccess.setZone(gameDTO, cardUUID, Zones.HAND);
                Log.send(eachPlayer.name + " drew " + lu.fname(cardUUID) + ". Owner garuntee: " + lu.owner(cardUUID));
            }
        });
    }
    static createNewCardDTO(gameDTO, id, ownerUUID) {
        var dto = new GameDTO_Card();
        dto.definitionId = id;
        dto.ownerUUID = ownerUUID;
        dto.uuid = UUID();
        dto.zoneId = Zones.SUPPLY;
        dto.zoneIndex = GameDTOAccess.getCardsInPile(gameDTO, id).length;
        ReactionBuffer.RegisterReactiveComponent(new ReactionKey(ReactionSourceType.CARD, dto.uuid), (gameDTOArg, uuid) => {
            var cardDTO = GameDTOAccess.getCardDTO(gameDTOArg, uuid);
            return CardDefinition.createFromDTO(cardDTO);
        });
        return dto;
    }
}
GamePopulator.kingdomCards = [
    CardIds.WORKSHOP,
    CardIds.WITCH,
    CardIds.MOAT,
    CardIds.CELLAR,
    CardIds.LIBRARY,
    CardIds.ARTISAN,
    CardIds.BANDIT,
    CardIds.BUREAUCRAT,
    CardIds.CHAPEL,
    CardIds.COUNCIL_ROOM,
    CardIds.FESTIVAL,
    CardIds.HARBINGER,
    CardIds.LABORATORY,
    CardIds.MARKET,
    CardIds.MERCHANT,
    CardIds.MILITIA,
    CardIds.MINE,
    CardIds.MONEYLENDER,
    CardIds.POACHER,
    CardIds.REMODEL,
    CardIds.SENTRY,
    CardIds.SMITHY,
    CardIds.THRONE_ROOM,
    CardIds.VASSAL,
    CardIds.VILLAGE
];
GamePopulator.otherSupplyCards = [
    [CardIds.COPPER, 60],
    [CardIds.SILVER, 40],
    [CardIds.GOLD, 30],
    [CardIds.ESTATE, 24],
    [CardIds.DUCHY, 12],
    [CardIds.PROVINCE, 12],
    [CardIds.CURSE, 10]
];
class EventArgs {
    constructor() {
        this.data = {};
    }
    add(key, value) {
        this.data[key] = value;
        return this;
    }
}
var EventIds;
(function (EventIds) {
    EventIds[EventIds["CARD_PLAYED"] = 0] = "CARD_PLAYED";
    EventIds[EventIds["ADD_MONEY"] = 1] = "ADD_MONEY";
    EventIds[EventIds["GAIN_CARD"] = 2] = "GAIN_CARD";
    EventIds[EventIds["DRAW_CARD"] = 3] = "DRAW_CARD";
    EventIds[EventIds["SET_UNAFFECTED"] = 4] = "SET_UNAFFECTED";
    EventIds[EventIds["REVEAL_CARD"] = 5] = "REVEAL_CARD";
    EventIds[EventIds["DISCARD_CARD"] = 6] = "DISCARD_CARD";
    EventIds[EventIds["TRASH_CARD"] = 7] = "TRASH_CARD";
    EventIds[EventIds["SET_CARD_ONTO_DECK"] = 8] = "SET_CARD_ONTO_DECK";
    EventIds[EventIds["PLACE_IN_DECK"] = 9] = "PLACE_IN_DECK";
    EventIds[EventIds["ADD_ACTION"] = 10] = "ADD_ACTION";
    EventIds[EventIds["ADD_BUYS"] = 11] = "ADD_BUYS";
    EventIds[EventIds["RESHUFFLE_DECK"] = 12] = "RESHUFFLE_DECK";
    EventIds[EventIds["ADVANCE_PHASE"] = 13] = "ADVANCE_PHASE";
})(EventIds || (EventIds = {}));
var EventSourceType;
(function (EventSourceType) {
    EventSourceType[EventSourceType["CARD"] = 0] = "CARD";
    EventSourceType[EventSourceType["PLAYER"] = 1] = "PLAYER";
})(EventSourceType || (EventSourceType = {}));
class EventStack {
    constructor() {
        this.events = [];
    }
    processAndAdvance(gameDTO) {
        EventStack.currentOutput = new EventStackOutput();
        var topEvent = this.events[this.events.length - 1];
        //Log.send(EventIds[topEvent.getId()] + " " + EventStatus[topEvent.status] + " reactionsPolled? " + topEvent.reactionsPolled);
        if (topEvent.reactionsPolled == false) {
            var reactions = ReactionBuffer.pollReactions(topEvent, gameDTO);
            //Log.send("EventStack: " + JSON.stringify(gameDTO.engine.eventStack));
            //Log.send("Reactions: " + JSON.stringify(reactions));
            if (reactions.length > 0) {
                var newReactionBuffer = new ReactionBuffer(topEvent.uuid, topEvent.status, reactions);
                GameDTOAccess.pushNewReactionBuffer(gameDTO, newReactionBuffer);
                EventStack.currentOutput.reactionsGenerated = true;
            }
            topEvent.reactionsPolled = true;
            GameDTOAccess.updateEvent(gameDTO, topEvent);
        }
        else {
            topEvent.reactionsPolled = false;
            if (topEvent.status == EventStatus.DECLARED) {
                topEvent.status = EventStatus.RESOLVING;
                GameDTOAccess.updateEvent(gameDTO, topEvent);
            }
            else if (topEvent.status == EventStatus.RESOLVING) {
                topEvent.execute(gameDTO);
                topEvent.status = EventStatus.RESOLVED;
                GameDTOAccess.updateEvent(gameDTO, topEvent);
            }
            else if (topEvent.status == EventStatus.RESOLVED) {
                EventStack.currentOutput.isCurrentBufferComplete = true;
                GameDTOAccess.removeEvent(gameDTO, topEvent);
            }
        }
        //Log.send("EventStack after EventStack.advance: " + JSON.stringify(gameDTO.engine.eventStack));
        return EventStack.currentOutput;
    }
}
class EventStackOutput {
}
var EventStatus;
(function (EventStatus) {
    EventStatus[EventStatus["DECLARED"] = 0] = "DECLARED";
    EventStatus[EventStatus["RESOLVING"] = 1] = "RESOLVING";
    EventStatus[EventStatus["RESOLVED"] = 2] = "RESOLVED";
})(EventStatus || (EventStatus = {}));
class GameEvent {
    constructor(eventSource, eventSourceUUID, args) {
        this.status = EventStatus.DECLARED;
        this.reactionsPolled = false;
        if (args != null) {
            this.eventSource = eventSource;
            this.eventSourceUUID = eventSourceUUID;
            this.uuid = UUID();
            this.args = args;
            this.populateFromArgs(args);
        }
    }
    static create(eventId, args) {
        return GameEvent.EVENT_DEFINITION[eventId](args);
    }
    static createWithStatus(eventId, status, args) {
        var event = GameEvent.EVENT_DEFINITION[eventId](args);
        event.status = status;
        return event;
    }
    static createFromDTO(dto) {
        var event = GameEvent.EVENT_DEFINITION[dto.eventId](dto.args);
        event.populateFromArgs(dto.args);
        event.status = dto.status;
        event.reactionsPolled = dto.reactionsPolled;
        event.uuid = dto.eventUUID;
        event.eventSourceUUID = dto.sourceUUID;
        return event;
    }
    convertToDTO() {
        var eventEntry = new GameDTO_EventEntry();
        eventEntry.sourceType = this.eventSource;
        eventEntry.eventId = this.getId();
        eventEntry.sourceUUID = this.eventSourceUUID;
        eventEntry.args = this.args;
        eventEntry.reactionsPolled = this.reactionsPolled;
        eventEntry.status = this.status;
        return eventEntry;
    }
    static registerCardGenerator(id, generator) {
        GameEvent.EVENT_DEFINITION[id] = generator;
    }
    configureGenerator() {
        var _this = this;
        GameEvent.registerCardGenerator(this.getId(), (args) => {
            var instance = new _this.constructor(null, null, args);
            return instance;
        });
    }
}
GameEvent.EVENT_DEFINITION = {};
function RegisterEvent(gameEventType) {
    new gameEventType().configureGenerator();
}
///<reference path="../GameEvent.ts" />
///<reference path="../EventArgs.ts" />
class AddActionEvent extends GameEvent {
    populateFromArgs(args) {
        this.playerToAddActionToUUID = args[AddActionEvent.PLAYER_UUID];
        this.amount = args[AddActionEvent.AMOUNT];
    }
    getId() {
        return EventIds.ADD_ACTION;
    }
    execute(gameDTO) {
        var player = GameDTOAccess.getPlayerFromUUID(gameDTO, this.playerToAddActionToUUID);
        player.turn.actions += this.amount;
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.fname(this.playerToAddActionToUUID) + " received +" + this.amount + " Action(s).");
    }
}
AddActionEvent.PLAYER_UUID = "PLAYER_UUID";
AddActionEvent.AMOUNT = "AMOUNT";
class AddActionEventArgs extends EventArgs {
    constructor(playerUUID, amount) {
        super();
        this.add(AddActionEvent.PLAYER_UUID, playerUUID).add(AddActionEvent.AMOUNT, amount);
    }
}
RegisterEvent(AddActionEvent);
///<reference path="../GameEvent.ts" />
///<reference path="../EventArgs.ts" />
class AddBuysEvent extends GameEvent {
    populateFromArgs(args) {
        this.playerToAddMoneyToUUID = args[AddBuysEvent.PLAYER_UUID];
        this.amount = args[AddBuysEvent.AMOUNT];
    }
    getId() {
        return EventIds.ADD_BUYS;
    }
    execute(gameDTO) {
        var player = GameDTOAccess.getPlayerFromUUID(gameDTO, this.playerToAddMoneyToUUID);
        player.turn.buys += this.amount;
    }
}
AddBuysEvent.PLAYER_UUID = "PLAYER_UUID";
AddBuysEvent.AMOUNT = "AMOUNT";
class AddBuysEventArgs extends EventArgs {
    constructor(playerUUID, amount) {
        super();
        this.add(AddBuysEvent.PLAYER_UUID, playerUUID).add(AddBuysEvent.AMOUNT, amount);
    }
}
RegisterEvent(AddBuysEvent);
///<reference path="../GameEvent.ts" />
///<reference path="../EventArgs.ts" />
class AddMoneyEvent extends GameEvent {
    populateFromArgs(args) {
        this.playerToAddMoneyToUUID = args[AddMoneyEvent.PLAYER_UUID];
        this.amount = args[AddMoneyEvent.AMOUNT];
    }
    getId() {
        return EventIds.ADD_MONEY;
    }
    execute(gameDTO) {
        var player = GameDTOAccess.getPlayerFromUUID(gameDTO, this.playerToAddMoneyToUUID);
        player.turn.money += this.amount;
        var lu = new LoggingUtils(gameDTO);
        if (this.amount >= 0) {
            Log.send(lu.fname(this.playerToAddMoneyToUUID) + " +" + this.amount + "  money.");
        }
        else {
            Log.send(lu.fname(this.playerToAddMoneyToUUID) + " " + this.amount + "  money.");
        }
    }
}
AddMoneyEvent.PLAYER_UUID = "PLAYER_UUID";
AddMoneyEvent.AMOUNT = "AMOUNT";
class AddMoneyEventArgs extends EventArgs {
    constructor(playerUUID, amount) {
        super();
        this.add(AddMoneyEvent.PLAYER_UUID, playerUUID).add(AddMoneyEvent.AMOUNT, amount);
    }
}
RegisterEvent(AddMoneyEvent);
class AdvancePhaseEvent extends GameEvent {
    populateFromArgs(args) {
    }
    getId() {
        return EventIds.ADVANCE_PHASE;
    }
    execute(gameDTO) {
        if (gameDTO.state.phase == Phase.ACTION) {
            gameDTO.state.phase = Phase.BUY;
        }
        else if (gameDTO.state.phase == Phase.BUY) {
            gameDTO.state.phase = Phase.CLEAN_UP;
        }
        else if (gameDTO.state.phase == Phase.CLEAN_UP) {
            gameDTO.state.phase = Phase.ACTION;
            GameDTOAccess.changeTurns(gameDTO);
        }
        Log.send("Phase is now " + Phase[gameDTO.state.phase]);
    }
}
RegisterEvent(AdvancePhaseEvent);
class CardPlayedEvent extends GameEvent {
    execute(gameDTO) {
        GameDTOAccess.setZone(gameDTO, this.CARD_UUID, Zones.IN_PLAY);
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.owner(this.CARD_UUID) + " played " + lu.fname(this.CARD_UUID));
    }
    populateFromArgs(args) {
        this.CARD_UUID = args[CardPlayedEvent.CARD_UUID];
    }
    getId() {
        return EventIds.CARD_PLAYED;
    }
}
CardPlayedEvent.CARD_UUID = "CARD_UUID";
class CardPlayedEventArgs extends EventArgs {
    constructor(cardUUID) {
        super();
        this.add(CardPlayedEvent.CARD_UUID, cardUUID);
    }
}
RegisterEvent(CardPlayedEvent);
///<reference path="../GameEvent.ts" />
class DiscardCardsEvent extends GameEvent {
    populateFromArgs(args) {
        this.chosenCard = args[DiscardCardsEvent.CHOSEN_CARD];
    }
    getId() {
        return EventIds.DISCARD_CARD;
    }
    execute(gameDTO) {
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.owner(this.chosenCard) + " discards " + lu.fname(this.chosenCard));
        GameDTOAccess.setZone(gameDTO, this.chosenCard, Zones.DISCARD_PILE);
    }
}
DiscardCardsEvent.CHOSEN_CARD = "CHOSEN_CARD";
class DiscardCardsEventArgs extends EventArgs {
    constructor(chosenCard) {
        super();
        this.add(DiscardCardsEvent.CHOSEN_CARD, chosenCard);
    }
}
RegisterEvent(DiscardCardsEvent);
///<reference path="../GameEvent.ts" />
class DrawCardsEvent extends GameEvent {
    constructor() {
        super(...arguments);
        this.amount = 1;
    }
    populateFromArgs(args) {
        this.recipient = args[DrawCardsEvent.RECIPIENT];
    }
    getId() {
        return EventIds.DRAW_CARD;
    }
    execute(gameDTO) {
        var lu = new LoggingUtils(gameDTO);
        var deck = GameDTOAccess.getCardDTOsInZone(gameDTO, this.recipient, Zones.DECK);
        var cardUUID = GameDTOAccess.getTopCardOfDeck(gameDTO, this.recipient);
        GameDTOAccess.setZone(gameDTO, cardUUID, Zones.HAND);
        Log.send(lu.owner(cardUUID) + " draws " + lu.fname(cardUUID));
    }
}
DrawCardsEvent.RECIPIENT = "RECIPIENT";
class DrawCardsEventArgs extends EventArgs {
    constructor(recipient) {
        super();
        this.add(DrawCardsEvent.RECIPIENT, recipient);
    }
}
RegisterEvent(DrawCardsEvent);
/*///<reference path="../GameEvent.ts" />

class GainActionsEvent extends GameEvent {

    static RECIPIENT: string = "RECIPIENT";
    static AMOUNT: string = "AMOUNT";

    playerToAddMoneyToUUID: string;
    amount: number;

    populateFromArgs(args: {}): void {
        this.playerToAddMoneyToUUID = args[GainActionsEvent.RECIPIENT];
        this.amount = args[GainActionsEvent.AMOUNT];
    }

    getId(): number {
        return EventIds.ADD_ACTION;
    }

    execute(gameDTO: GameDTO): void {

    }

}

class GainActionsEventArgs extends EventArgs {

    constructor(recipient: EffectBufferVariable, amount: EffectBufferVariable) {
        super();
        this.add(GainActionsEvent.RECIPIENT, recipient).add(GainActionsEvent.AMOUNT, amount);
    }

}

RegisterEvent(GainActionsEvent);*/ 
////<reference path="../GameEvent.ts" />
class GainCardEvent extends GameEvent {
    populateFromArgs(args) {
        this.recipient = args[GainCardEvent.RECIPIENT];
        this.chosenCard = args[GainCardEvent.CHOSEN_CARD];
        if (args[GainCardEvent.GAIN_LOCATION] == null) {
            this.gainLocation = Zones.DISCARD_PILE;
        }
        else {
            this.gainLocation = args[GainCardEvent.GAIN_LOCATION];
        }
    }
    getId() {
        return EventIds.GAIN_CARD;
    }
    execute(gameDTO) {
        GameDTOAccess.setOwner(gameDTO, this.chosenCard, this.recipient);
        GameDTOAccess.setZone(gameDTO, this.chosenCard, this.gainLocation);
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.owner(this.chosenCard) + " gained a(n) " + lu.fname(this.chosenCard) + " to " + Zones[this.gainLocation]);
    }
}
GainCardEvent.GAIN_LOCATION = "GAIN_LOCATION";
GainCardEvent.RECIPIENT = "RECIPIENT";
GainCardEvent.CHOSEN_CARD = "CHOSEN_CARD";
class GainCardEventArgs extends EventArgs {
    constructor(recipient, chosenCard, gainLocation) {
        super();
        this.add(GainCardEvent.RECIPIENT, recipient).add(GainCardEvent.CHOSEN_CARD, chosenCard).add(GainCardEvent.GAIN_LOCATION, gainLocation);
    }
}
RegisterEvent(GainCardEvent);
class PlaceInDeckEvent extends GameEvent {
    populateFromArgs(args) {
        this.cardUUID = args[PlaceInDeckEvent.CARD_UUID];
        this.index = args[PlaceInDeckEvent.INDEX];
    }
    getId() {
        return EventIds.PLACE_IN_DECK;
    }
    execute(gameDTO) {
        GameDTOAccess.setZone(gameDTO, this.cardUUID, Zones.DECK);
        if (this.index == PlaceInDeckEventOptions.TOP) {
            GameDTOAccess.setDeckIndex(gameDTO, this.cardUUID, deckSize - 1);
        }
        else {
            var owner = GameDTOAccess.getOwner(gameDTO, this.cardUUID);
            var deckSize = GameDTOAccess.getCardsInZone(gameDTO, owner, Zones.DECK).length;
            GameDTOAccess.setDeckIndex(gameDTO, this.cardUUID, 0);
        }
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.owner(this.cardUUID) + " placed " + lu.fname(this.cardUUID) + " at deck position " + this.index);
    }
}
PlaceInDeckEvent.CARD_UUID = "CARD_UUID";
PlaceInDeckEvent.INDEX = "INDEX";
class PlaceInDeckEventArgs extends EventArgs {
    constructor(cardUUID, index) {
        super();
        this.add(PlaceInDeckEvent.CARD_UUID, cardUUID).add(PlaceInDeckEvent.INDEX, index);
    }
}
class PlaceInDeckEventOptions {
}
PlaceInDeckEventOptions.TOP = "TOP";
PlaceInDeckEventOptions.BOTTOM = "BOTTOM";
RegisterEvent(PlaceInDeckEvent);
///<reference path="../GameEvent.ts" />
class ReshuffleDeckEvent extends GameEvent {
    populateFromArgs(args) {
        this.recipient = args[ReshuffleDeckEvent.WHOSE_DECK];
    }
    getId() {
        return EventIds.RESHUFFLE_DECK;
    }
    execute(gameDTO) {
        var lu = new LoggingUtils(gameDTO);
        GameDTOAccess.getCardsInZone(gameDTO, this.recipient, Zones.DISCARD_PILE).forEach((eachUUID) => {
            GameDTOAccess.setZone(gameDTO, eachUUID, Zones.DECK);
        });
        GameDTOAccess.shuffleDeck(gameDTO, this.recipient);
        Log.send(lu.fname(this.recipient) + " reshuffles.");
    }
}
ReshuffleDeckEvent.WHOSE_DECK = "WHOSE_DECK";
class ReshuffleDeckEventArgs extends EventArgs {
    constructor(whose) {
        super();
        this.add(ReshuffleDeckEvent.WHOSE_DECK, whose);
    }
}
RegisterEvent(ReshuffleDeckEvent);
///<reference path="../GameEvent.ts" />
class RevealCardEvent extends GameEvent {
    execute(gameDTO) {
        var lu = new LoggingUtils(gameDTO);
        GameDTOAccess.setZone(gameDTO, this.chosenCard, Zones.REVEALED);
        Log.send(lu.owner(this.chosenCard) + " revealed a(n) " + lu.fname(this.chosenCard));
    }
    populateFromArgs(args) {
        this.chosenCard = args[RevealCardEvent.CARD_UUID];
    }
    getId() {
        return EventIds.REVEAL_CARD;
    }
}
RevealCardEvent.CARD_UUID = "CARD_UUID";
class RevealCardEventArgs extends EventArgs {
    constructor(cardUUID) {
        super();
        this.add(RevealCardEvent.CARD_UUID, cardUUID);
    }
}
RegisterEvent(RevealCardEvent);
///<reference path="../GameEvent.ts" />
class SetCardOntoDeckEvent extends GameEvent {
    populateFromArgs(args) {
        this.recipient = args[SetCardOntoDeckEvent.AFFECTED_PLAYER];
        this.chosenCard = args[SetCardOntoDeckEvent.CHOSEN_CARD];
    }
    getId() {
        return EventIds.SET_CARD_ONTO_DECK;
    }
    execute(gameDTO) {
        var lu = new LoggingUtils(gameDTO);
        GameDTOAccess.setZone(gameDTO, this.chosenCard, Zones.DECK);
        var deckSize = GameDTOAccess.getCardsInZone(gameDTO, this.recipient, Zones.DECK).length;
        GameDTOAccess.setDeckIndex(gameDTO, this.chosenCard, deckSize - 1);
        Log.send(lu.owner(this.chosenCard) + " puts " + lu.fname(this.chosenCard) + " on top of the deck.");
    }
}
SetCardOntoDeckEvent.AFFECTED_PLAYER = "RECIPIENT";
SetCardOntoDeckEvent.CHOSEN_CARD = "CHOSEN_CARD";
class SetCardOntoDeckEventArgs extends EventArgs {
    constructor(affectedPlayers, chosenCard) {
        super();
        this.add(SetCardOntoDeckEvent.AFFECTED_PLAYER, affectedPlayers).add(SetCardOntoDeckEvent.CHOSEN_CARD, chosenCard);
    }
}
RegisterEvent(SetCardOntoDeckEvent);
///<reference path="../GameEvent.ts" />
class SetUnaffectedEvent extends GameEvent {
    populateFromArgs(args) {
        this.recipient = args[SetUnaffectedEvent.PROTECTED_PLAYER];
        this.cardProtectedFrom = args[SetUnaffectedEvent.PROTECTED_FROM];
        this.action = args[SetUnaffectedEvent.ACTION];
    }
    getId() {
        return EventIds.SET_UNAFFECTED;
    }
    execute(gameDTO) {
        if (this.action == SetUnaffectedEventAction.SET) {
            GameDTOAccess.setPlayerUnaffectedByEffect(gameDTO, this.recipient, this.cardProtectedFrom);
        }
        else if (this.action == SetUnaffectedEventAction.REMOVE) {
            GameDTOAccess.removePlayerUnaffectedByEffect(gameDTO, this.recipient, this.cardProtectedFrom);
        }
    }
}
SetUnaffectedEvent.PROTECTED_PLAYER = "PROTECTED_PLAYER";
SetUnaffectedEvent.PROTECTED_FROM = "PROTECTED_FROM";
SetUnaffectedEvent.ACTION = "ACTION";
class SetUnaffectedEventArgs extends EventArgs {
    constructor(protectedPlayer, protectedFrom, action) {
        super();
        this.add(SetUnaffectedEvent.PROTECTED_PLAYER, protectedPlayer).add(SetUnaffectedEvent.PROTECTED_FROM, protectedFrom).add(SetUnaffectedEvent.ACTION, action);
    }
}
var SetUnaffectedEventAction;
(function (SetUnaffectedEventAction) {
    SetUnaffectedEventAction[SetUnaffectedEventAction["SET"] = 0] = "SET";
    SetUnaffectedEventAction[SetUnaffectedEventAction["REMOVE"] = 1] = "REMOVE";
})(SetUnaffectedEventAction || (SetUnaffectedEventAction = {}));
RegisterEvent(SetUnaffectedEvent);
class TrashCardsEvent extends GameEvent {
    populateFromArgs(args) {
        this.chosenCard = args[TrashCardsEvent.CARD_UUID];
    }
    getId() {
        return EventIds.TRASH_CARD;
    }
    execute(gameDTO) {
        GameDTOAccess.setZone(gameDTO, this.chosenCard, Zones.TRASH);
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.owner(this.chosenCard) + " trashed a(n) " + lu.fname(this.chosenCard));
    }
}
TrashCardsEvent.CARD_UUID = "CARD_UUID";
class TrashCardsEventArgs extends EventArgs {
    constructor(cardUUID) {
        super();
        this.add(PlaceInDeckEvent.CARD_UUID, cardUUID);
    }
}
RegisterEvent(TrashCardsEvent);
class LogicalBuffer {
    constructor() {
        this.steps = [];
        this.storedData = {};
        this.isComplete = false;
    }
    addStep(step) {
        this.steps.push(step);
    }
    addSteps(...steps) {
        var __this = this;
        steps.forEach((value) => {
            __this.steps.push(value);
        });
    }
    addAllSteps(steps) {
        var __this = this;
        steps.forEach((value) => {
            __this.steps.push(value);
        });
    }
    processAndAdvance(gameDTO) {
        if (this.currentStepUUID == null) {
            this.currentStepUUID = this.steps[0].uuid;
        }
        var currentStep = this.getCurrentStep();
        //Log.send("Executing step: " + StepId[currentStep.getStepId()])
        var isComplete = currentStep.processAndAdvance(this, gameDTO);
        if (isComplete) {
            if (this.currentStepUUID == currentStep.uuid) {
                var indexOf = this.steps.indexOf(currentStep);
                if ((indexOf >= (this.steps.length - 1))) {
                    this.currentStepUUID = null;
                    this.isComplete = true;
                }
                else {
                    this.currentStepUUID = this.steps[indexOf + 1].uuid;
                }
            }
        }
        GameDTOAccess.updateLogicalBuffer(gameDTO, this);
        return this.isComplete;
    }
    getCurrentStep() {
        var result = null;
        var __this = this;
        if (this.currentStepUUID == null) {
            this.currentStepUUID = this.steps[0].uuid;
        }
        this.steps.forEach((value) => {
            if (value.uuid == __this.currentStepUUID) {
                result = value;
            }
        });
        return result;
    }
    static createFromDTO(dto, gameDTO) {
        var obj = new LogicalBuffer();
        obj.uuid = dto.uuid;
        obj.currentStepUUID = dto.currentStep;
        obj.steps = [];
        obj.storedData = dto.storedData;
        dto.steps.forEach((each) => {
            obj.steps.push(LogicalStep.create(each.stepId, each, obj, gameDTO));
        });
        return obj;
    }
    convertToDTO(gameDTO) {
        var __this = this;
        var dto = new GameDTO_LogicalBuffer();
        dto.uuid = this.uuid;
        dto.currentStep = this.currentStepUUID;
        dto.steps = [];
        dto.storedData = this.storedData;
        this.steps.forEach((each) => {
            dto.steps.push(each.convertToDTO());
        });
        return dto;
    }
    reset() {
        this.steps.forEach((eachStep) => {
            eachStep.reset();
        });
        this.storedData = {};
    }
}
class LogicalStack {
    constructor() {
        this.buffers = [];
    }
    processAndAdvance(gameDTO) {
        LogicalStack.currentOutput = new LogicalStackOutput();
        var topBuffer = this.buffers[this.buffers.length - 1];
        var isComplete = topBuffer.processAndAdvance(gameDTO);
        if (isComplete) {
            LogicalStack.currentOutput.isCurrentBufferComplete = true;
            GameDTOAccess.removeLogicalBuffer(gameDTO, topBuffer);
        }
        if (this.buffers.length == 0) {
            LogicalStack.currentOutput.isEmpty = true;
            LogicalStack.currentOutput.isCurrentBufferComplete = true;
        }
        return LogicalStack.currentOutput;
    }
}
class LogicalStackOutput {
}
class LogicalStep {
    constructor() {
        this.uuid = UUID();
    }
    configureGenerator() {
        var _this = this;
        LogicalStep.registerCardGenerator(this.getStepId(), (dto, logicalBuffer, gameDTO) => {
            var instance = new _this.constructor();
            instance.constructFromDTO(dto, logicalBuffer, gameDTO);
            return instance;
        });
    }
    static createFromDTO(dto, logicalBuffer, gameDTO) {
        return LogicalStep.create(dto.stepId, dto, logicalBuffer, gameDTO);
    }
    static registerCardGenerator(id, generator) {
        LogicalStep.STEP_DEFINITION[id] = generator;
    }
    static create(id, dto, logicalBuffer, gameDTO) {
        return LogicalStep.STEP_DEFINITION[id](dto, logicalBuffer, gameDTO);
    }
}
LogicalStep.STEP_DEFINITION = {};
function RegisterEventBufferStep(stepType) {
    new stepType().configureGenerator();
}
class LogicalUtils {
    Value(value) {
        return new LogicalValue(value);
    }
    Reference(value) {
        return new LogicalReference(value);
    }
    Exactly(value) {
        return new PlayerChoicePreposition(PlayerChoicePrepositionValues.EXACTLY, value);
    }
    UpTo(value) {
        return new PlayerChoicePreposition(PlayerChoicePrepositionValues.UP_TO, value);
    }
    CreateEvent(eventId, eventGeneratorArgs) {
        return GameEvent.create(eventId, eventGeneratorArgs.data);
    }
    ResolveVariable(variable, logicalBuffer) {
        if (variable.type == LogicalVariableType.VALUE) {
            return variable.value;
        }
        else if (variable.type == LogicalVariableType.REFERENCE) {
            //Log.send(variable.value + " = " + logicalBuffer.storedData[variable.value]);
            return logicalBuffer.storedData[variable.value];
        }
    }
    SerializeString2DTOMap(valueMap) {
        var result = {};
        for (var key in valueMap) {
            if (valueMap.hasOwnProperty(key)) {
                result[key] = [];
                valueMap[key].forEach((value, index) => {
                    result[key].push(value.convertToDTO());
                });
            }
        }
        return result;
    }
    SerializeDTOArray(dtoArray) {
        var result = [];
        dtoArray.forEach((value) => {
            result.push(value.convertToDTO());
        });
        return result;
    }
}
var LogicalVariableType;
(function (LogicalVariableType) {
    LogicalVariableType[LogicalVariableType["VALUE"] = 0] = "VALUE";
    LogicalVariableType[LogicalVariableType["REFERENCE"] = 1] = "REFERENCE";
})(LogicalVariableType || (LogicalVariableType = {}));
class LogicalVariable {
    constructor(value) {
        this.value = value;
    }
    convertToDTO() {
        var dto = new GameDTO_LogicalBufferVariable();
        dto.type = this.type;
        dto.value = this.value;
        return dto;
    }
    static generateFromDTO(dto) {
        if (dto.type == LogicalVariableType.VALUE) {
            return new LogicalValue(dto.value);
        }
        else if (dto.type == LogicalVariableType.REFERENCE) {
            return new LogicalReference(dto.value);
        }
    }
}
class LogicalValue extends LogicalVariable {
    constructor() {
        super(...arguments);
        this.type = LogicalVariableType.VALUE;
    }
}
class LogicalReference extends LogicalVariable {
    constructor() {
        super(...arguments);
        this.type = LogicalVariableType.REFERENCE;
    }
}
var StepId;
(function (StepId) {
    StepId[StepId["JUMP_TO_STEP"] = 0] = "JUMP_TO_STEP";
    StepId[StepId["CONDITIONAL"] = 1] = "CONDITIONAL";
    StepId[StepId["CONTAINS"] = 2] = "CONTAINS";
    StepId[StepId["DRAW_CARDS"] = 3] = "DRAW_CARDS";
    StepId[StepId["EVENT_GENERATOR"] = 4] = "EVENT_GENERATOR";
    StepId[StepId["FOR_EACH"] = 5] = "FOR_EACH";
    StepId[StepId["LOAD_CARD"] = 6] = "LOAD_CARD";
    StepId[StepId["LOAD_DECK"] = 7] = "LOAD_DECK";
    StepId[StepId["LOAD_HAND"] = 8] = "LOAD_HAND";
    StepId[StepId["LOOP"] = 9] = "LOOP";
    StepId[StepId["PLAYER_CHOICE"] = 10] = "PLAYER_CHOICE";
    StepId[StepId["RELATIONAL"] = 11] = "RELATIONAL";
    StepId[StepId["QUERY"] = 12] = "QUERY";
    StepId[StepId["COUNT"] = 13] = "COUNT";
    StepId[StepId["ARRAY"] = 14] = "ARRAY";
    StepId[StepId["MATH"] = 15] = "MATH";
})(StepId || (StepId = {}));
var ArrayStepOptions;
(function (ArrayStepOptions) {
    ArrayStepOptions[ArrayStepOptions["ADD"] = 0] = "ADD";
})(ArrayStepOptions || (ArrayStepOptions = {}));
class ArrayStep extends LogicalStep {
    constructor(option, logicalBufferReferenceValue, logicalBufferReturnKey) {
        super();
        this.option = option;
        this.logicalBufferReferenceValue = logicalBufferReferenceValue;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        if (logicalBuffer.storedData[this.logicalBufferReturnKey] == null) {
            logicalBuffer.storedData[this.logicalBufferReturnKey] = [];
        }
        var _ = new LogicalUtils();
        var resolvedValue = _.ResolveVariable(this.logicalBufferReferenceValue, logicalBuffer);
        if (this.option == ArrayStepOptions.ADD) {
            logicalBuffer.storedData[this.logicalBufferReturnKey].push(resolvedValue);
        }
        return true;
    }
    getStepId() {
        return StepId.ARRAY;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.option = dto.args["option"];
        this.logicalBufferReferenceValue = LogicalVariable.generateFromDTO(dto.args["logicalBufferReferenceValue"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
    }
    convertToDTO() {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["option"] = this.option;
        dto.args["logicalBufferReferenceValue"] = this.logicalBufferReferenceValue.convertToDTO();
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        return dto;
    }
    reset() {
    }
    hasSubsteps() {
        return false;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return this;
    }
}
RegisterEventBufferStep(ArrayStep);
class CompoundStep extends LogicalStep {
    constructor(substeps) {
        super();
        this.currentSubstepIndex = 0;
        this.substeps = [];
        this.substeps = substeps;
    }
    hasSubsteps() {
        return true;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return this.substeps[this.currentSubstepIndex];
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        var _ = new LogicalUtils();
        var currentStep = this.substeps[this.currentSubstepIndex];
        var isSubStepComplete = currentStep.processAndAdvance(logicalBuffer, gameDTO);
        if (isSubStepComplete) {
            this.currentSubstepIndex++;
        }
        if (this.currentSubstepIndex >= this.substeps.length) {
            return true;
        }
        return false;
    }
    reset() {
        this.currentSubstepIndex = 0;
        this.substeps.forEach((eachStep) => {
            eachStep.reset();
        });
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
        this.substeps = [];
        for (var key in dto.args["substeps"]) {
            this.substeps[key] = LogicalStep.createFromDTO(dto.args["substeps"][key], logicalBuffer, gameDTO);
        }
    }
    convertToDTO() {
        var _ = new LogicalUtils();
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["currentSubstepIndex"] = this.currentSubstepIndex;
        dto.args["substeps"] = _.SerializeDTOArray(this.substeps);
        return dto;
    }
}
///<reference path="../LogicalStep.ts" />
class ConditionalStep extends LogicalStep {
    constructor(conditionalBufferVariable, valueMap) {
        super();
        this.valueMap = {};
        this.currentSubstepIndex = 0;
        this.conditionalBufferVariable = conditionalBufferVariable;
        this.valueMap = valueMap;
    }
    hasSubsteps() {
        return true;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        var _ = new LogicalUtils();
        var conditionalBufferValue = _.ResolveVariable(this.conditionalBufferVariable, logicalBuffer);
        var chosenPath = this.valueMap[conditionalBufferValue];
        var currentStep = chosenPath[this.currentSubstepIndex];
        return currentStep;
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        var _ = new LogicalUtils();
        var conditionalBufferValue = _.ResolveVariable(this.conditionalBufferVariable, logicalBuffer);
        var chosenPath = this.valueMap[conditionalBufferValue];
        if (chosenPath != null) {
            var currentStep = chosenPath[this.currentSubstepIndex];
            var isSubStepComplete = currentStep.processAndAdvance(logicalBuffer, gameDTO);
            if (isSubStepComplete) {
                this.currentSubstepIndex++;
            }
            if (this.currentSubstepIndex >= chosenPath.length) {
                return true;
            }
            return false;
        }
        return true;
    }
    reset() {
        this.currentSubstepIndex = 0;
        for (var key in this.valueMap) {
            var chosenPath = this.valueMap[key];
            chosenPath.forEach((eachStep) => {
                eachStep.reset();
            });
        }
    }
    getStepId() {
        return StepId.CONDITIONAL;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.conditionalBufferVariable = LogicalVariable.generateFromDTO(dto.args["conditionalBufferVariable"]);
        this.valueMap = {};
        for (var key in dto.args["valueMap"]) {
            this.valueMap[key] = [];
            dto.args["valueMap"][key].forEach((eachValue) => {
                this.valueMap[key].push(LogicalStep.createFromDTO(eachValue, logicalBuffer, gameDTO));
            });
        }
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
    }
    convertToDTO() {
        var _ = new LogicalUtils();
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["conditionalBufferVariable"] = this.conditionalBufferVariable.convertToDTO();
        dto.args["valueMap"] = _.SerializeString2DTOMap(this.valueMap);
        dto.args["currentSubstepIndex"] = this.currentSubstepIndex;
        return dto;
    }
}
RegisterEventBufferStep(ConditionalStep);
///<reference path="../LogicalStep.ts" />
class ContainsStep extends LogicalStep {
    constructor(valueToCheckFor, setToCheckIn, stepsToPerform, doesntContain) {
        super();
        this.currentSubstepIndex = 0;
        this.valueToCheckFor = valueToCheckFor;
        this.setToCheckIn = setToCheckIn;
        this.stepsToPerform = stepsToPerform;
        if (doesntContain != null) {
            this.doesntContain = doesntContain;
        }
        else {
            this.doesntContain = false;
        }
    }
    hasSubsteps() {
        return true;
    }
    reset() {
        this.currentSubstepIndex = 0;
        this.stepsToPerform.forEach((eachStep) => {
            eachStep.reset();
        });
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return this.stepsToPerform[this.currentSubstepIndex];
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        var _ = new LogicalUtils();
        var resolvedValue = _.ResolveVariable(this.valueToCheckFor, logicalBuffer);
        var resolvedSetValue = _.ResolveVariable(this.setToCheckIn, logicalBuffer);
        var fitsRequirement = null;
        if (this.doesntContain) {
            fitsRequirement = resolvedSetValue.indexOf(resolvedValue) == -1;
        }
        else {
            fitsRequirement = resolvedSetValue.indexOf(resolvedValue) != -1;
        }
        if (fitsRequirement) {
            var currentStep = this.stepsToPerform[this.currentSubstepIndex];
            var isSubStepComplete = currentStep.processAndAdvance(logicalBuffer, gameDTO);
            if (isSubStepComplete) {
                this.currentSubstepIndex++;
            }
            if (this.currentSubstepIndex >= this.stepsToPerform.length) {
                return true;
            }
            return false;
        }
        return true;
    }
    getStepId() {
        return StepId.CONTAINS;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.valueToCheckFor = LogicalVariable.generateFromDTO(dto.args["valueToCheckFor"]);
        this.setToCheckIn = LogicalVariable.generateFromDTO(dto.args["setToCheckIn"]);
        this.stepsToPerform = [];
        for (var key in dto.args["stepsToPerform"]) {
            this.stepsToPerform[key] = LogicalStep.createFromDTO(dto.args["stepsToPerform"][key], logicalBuffer, gameDTO);
        }
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
        this.doesntContain = dto.args["doesntContain"];
    }
    convertToDTO() {
        var _ = new LogicalUtils();
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["valueToCheckFor"] = this.valueToCheckFor.convertToDTO();
        dto.args["setToCheckIn"] = this.setToCheckIn.convertToDTO();
        dto.args["stepsToPerform"] = _.SerializeDTOArray(this.stepsToPerform);
        dto.args["currentSubstepIndex"] = this.currentSubstepIndex;
        dto.args["doesntContain"] = this.doesntContain;
        return dto;
    }
}
ContainsStep.DOES_NOT_CONTAIN = true;
RegisterEventBufferStep(ContainsStep);
class CountStep extends LogicalStep {
    constructor(setOne, logicalBufferReturnKey) {
        super();
        this.setOne = setOne;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }
    hasSubsteps() {
        return true;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return this;
    }
    reset() {
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        var _ = new LogicalUtils();
        var setArg = _.ResolveVariable(this.setOne, logicalBuffer);
        if (setArg == null || setArg == undefined) {
            logicalBuffer.storedData[this.logicalBufferReturnKey] = 0;
        }
        else {
            logicalBuffer.storedData[this.logicalBufferReturnKey] = setArg.length;
        }
        return true;
    }
    getStepId() {
        return StepId.COUNT;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.setOne = LogicalVariable.generateFromDTO(dto.args["setOne"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
    }
    convertToDTO() {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["setOne"] = this.setOne.convertToDTO();
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        return dto;
    }
}
RegisterEventBufferStep(CountStep);
class DrawCardsStep extends CompoundStep {
    constructor(ownerUUID, amount) {
        var steps = [];
        if (ownerUUID != null && amount != null) {
            var _ = new LogicalUtils();
            if (amount.type == LogicalVariableType.VALUE) {
                var amountValue = amount.value;
                for (var i = 0; i < amountValue; i++) {
                    steps.push(new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(ownerUUID), "deckSize"));
                    steps.push(new RelationalStep(_.Reference("deckSize"), RelationalOptions.EQUALS, _.Value(0), [
                        new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(ownerUUID)))
                    ]));
                    steps.push(new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(ownerUUID), "deckSize"));
                    steps.push(new RelationalStep(_.Reference("deckSize"), RelationalOptions.GREATER_THAN, _.Value(0), [
                        new EventGeneratorStep(EventIds.DRAW_CARD, new DrawCardsEventArgs(_.Value(ownerUUID)))
                    ]));
                }
            }
            else if (amount.type == LogicalVariableType.REFERENCE) {
                steps.push(new LoopStep(amount, [
                    new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(ownerUUID), "deckSize"),
                    new RelationalStep(_.Reference("deckSize"), RelationalOptions.EQUALS, _.Value(0), [
                        new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(ownerUUID)))
                    ]),
                    new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(ownerUUID), "deckSize"),
                    new RelationalStep(_.Reference("deckSize"), RelationalOptions.GREATER_THAN, _.Value(0), [
                        new EventGeneratorStep(EventIds.DRAW_CARD, new DrawCardsEventArgs(_.Value(ownerUUID)))
                    ])
                ]));
            }
        }
        super(steps);
    }
    getStepId() {
        return StepId.DRAW_CARDS;
    }
}
RegisterEventBufferStep(DrawCardsStep);
///<reference path="../LogicalStep.ts" />
class EventGeneratorStep extends LogicalStep {
    constructor(eventId, eventGeneratorArgs) {
        super();
        this.eventId = eventId;
        this.eventGeneratorArgs = eventGeneratorArgs;
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        var _ = new LogicalUtils();
        var calculatedArgs = {};
        for (var key in this.eventGeneratorArgs.data) {
            if (this.eventGeneratorArgs.data[key] != null) {
                calculatedArgs[key] = _.ResolveVariable(LogicalVariable.generateFromDTO(this.eventGeneratorArgs.data[key]), logicalBuffer);
            }
            //Log.send("key: " + key + " value: " + calculatedArgs[key] + " logicbuffer: " + logicalBuffer.storedData[key]);
        }
        var event = GameEvent.create(this.eventId, calculatedArgs);
        GameDTOAccess.pushEventToStack(gameDTO, event);
        LogicalStack.currentOutput.eventsGenerated = true;
        gameDTO.state.state = GameState.RESOLVING_EVENT_STACK;
        return true;
    }
    getStepId() {
        return StepId.EVENT_GENERATOR;
    }
    reset() {
    }
    hasSubsteps() {
        return false;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return this;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.eventId = dto.args["eventId"];
        this.eventGeneratorArgs = new EventArgs();
        this.eventGeneratorArgs.data = dto.args["eventGeneratorArgs"];
    }
    convertToDTO() {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["eventId"] = this.eventId;
        dto.args["eventGeneratorArgs"] = this.eventGeneratorArgs.data;
        return dto;
    }
}
RegisterEventBufferStep(EventGeneratorStep);
class ForEachStep extends LogicalStep {
    constructor(listVariable, eachReferenceTag, stepsToLoop) {
        super();
        this.listVariable = listVariable;
        this.eachReferenceTag = eachReferenceTag;
        this.stepsToLoop = stepsToLoop;
        this.currentSubstepIndex = 0;
        this.currentListIndex = 0;
    }
    reset() {
        this.currentSubstepIndex = 0;
        this.currentListIndex = 0;
        this.stepsToLoop.forEach((eachStep) => {
            eachStep.reset();
        });
    }
    hasSubsteps() {
        return true;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return this.stepsToLoop[this.currentSubstepIndex];
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        var _ = new LogicalUtils();
        var listVariableParsed = _.ResolveVariable(this.listVariable, logicalBuffer);
        listVariableParsed = Util.convertToArray(listVariableParsed);
        //Log.send("For each will iterate " + listVariableParsed.length + " times. This is iteration " + this.currentListIndex);
        //listVariableParsed = JSON.parse(listVariableParsed);
        //Log.send("listVariableParsed: " + listVariableParsed + " length: " + listVariableParsed.length);
        if (listVariableParsed.length > 0) {
            var currentStep = this.stepsToLoop[this.currentSubstepIndex];
            logicalBuffer.storedData[this.eachReferenceTag] = listVariableParsed[this.currentListIndex];
            var isSubStepComplete = currentStep.processAndAdvance(logicalBuffer, gameDTO);
            if (isSubStepComplete) {
                this.currentSubstepIndex++;
            }
            if (this.currentSubstepIndex >= this.stepsToLoop.length) {
                this.currentListIndex++;
                if (this.currentListIndex >= listVariableParsed.length) {
                    return true;
                }
                else {
                    this.currentSubstepIndex = 0;
                    this.stepsToLoop.forEach((eachStep) => {
                        eachStep.reset();
                    });
                    return false;
                }
            }
        }
        else {
            return true;
        }
    }
    getStepId() {
        return StepId.FOR_EACH;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
        this.stepsToLoop = [];
        for (var key in dto.args["stepsToLoop"]) {
            this.stepsToLoop[key] = LogicalStep.createFromDTO(dto.args["stepsToLoop"][key], logicalBuffer, gameDTO);
        }
        this.listVariable = LogicalVariable.generateFromDTO(dto.args["listVariable"]);
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
        this.eachReferenceTag = dto.args["eachReferenceTag"];
        this.currentListIndex = dto.args["currentListIndex"];
    }
    convertToDTO() {
        var _ = new LogicalUtils();
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["currentSubstepIndex"] = this.currentSubstepIndex;
        dto.args["stepsToLoop"] = _.SerializeDTOArray(this.stepsToLoop);
        dto.args["listVariable"] = this.listVariable;
        dto.args["eachReferenceTag"] = this.eachReferenceTag;
        dto.args["currentListIndex"] = this.currentListIndex;
        return dto;
    }
}
RegisterEventBufferStep(ForEachStep);
///<reference path="../LogicalStep.ts" />
class JumpToStep extends LogicalStep {
    constructor(stepUUID) {
        super();
        this.stepUUID = stepUUID;
    }
    reset() {
    }
    hasSubsteps() {
        return false;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return this;
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        var _ = new LogicalUtils();
        logicalBuffer.reset();
        logicalBuffer.currentStepUUID = _.ResolveVariable(this.stepUUID, logicalBuffer);
        return true;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.stepUUID = LogicalVariable.generateFromDTO(dto.args["stepUUID"]);
    }
    convertToDTO() {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["stepUUID"] = this.stepUUID.convertToDTO();
        return dto;
    }
    getStepId() {
        return StepId.JUMP_TO_STEP;
    }
}
RegisterEventBufferStep(JumpToStep);
///<reference path="../LogicalStep.ts" />
var LoadCardInfoStepOptions;
(function (LoadCardInfoStepOptions) {
    LoadCardInfoStepOptions[LoadCardInfoStepOptions["TYPES"] = 0] = "TYPES";
    LoadCardInfoStepOptions[LoadCardInfoStepOptions["CARD_ID"] = 1] = "CARD_ID";
})(LoadCardInfoStepOptions || (LoadCardInfoStepOptions = {}));
class LoadCardInfoStep extends LogicalStep {
    constructor(option, logicalBufferReference, logicalBufferReturnKey) {
        super();
        this.option = option;
        this.logicalBufferReference = logicalBufferReference;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        var _ = new LogicalUtils();
        var cardID = _.ResolveVariable(this.logicalBufferReference, logicalBuffer);
        var requestedInfo = null;
        if (this.option == LoadCardInfoStepOptions.TYPES) {
            requestedInfo = GameDTOAccess.getCardDefinition(gameDTO, cardID).getCardTypes();
            var lu = new LoggingUtils(gameDTO);
            //Log.send("Loading card type for " + lu.fname(cardID) + " : " + requestedInfo);
        }
        else if (this.option == LoadCardInfoStepOptions.CARD_ID) {
            requestedInfo = GameDTOAccess.getCardDefinition(gameDTO, cardID).getCardId();
        }
        logicalBuffer.storedData[this.logicalBufferReturnKey] = requestedInfo;
        return true;
    }
    reset() {
    }
    hasSubsteps() {
        return false;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return this;
    }
    getStepId() {
        return StepId.LOAD_CARD;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.option = dto.args["option"];
        this.logicalBufferReference = LogicalVariable.generateFromDTO(dto.args["logicalBufferReference"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
    }
    convertToDTO() {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["option"] = this.option;
        dto.args["logicalBufferReference"] = this.logicalBufferReference.convertToDTO();
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        return dto;
    }
}
RegisterEventBufferStep(LoadCardInfoStep);
///<reference path="../LogicalStep.ts" />
var LoadDeckInfoStepOptions;
(function (LoadDeckInfoStepOptions) {
    LoadDeckInfoStepOptions[LoadDeckInfoStepOptions["TOP_CARD"] = 0] = "TOP_CARD";
    LoadDeckInfoStepOptions[LoadDeckInfoStepOptions["DECK_SIZE"] = 1] = "DECK_SIZE";
})(LoadDeckInfoStepOptions || (LoadDeckInfoStepOptions = {}));
class LoadDeckStepCardAtIndexFromTopOption {
    constructor(indexFromTop) {
        this.indexFromTop = indexFromTop;
    }
}
class LoadDeckInfoStep extends LogicalStep {
    constructor(option, logicalBufferReferencePlayerUUID, logicalBufferReturnKey) {
        super();
        this.option = option;
        this.logicalBufferReferencePlayerUUID = logicalBufferReferencePlayerUUID;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        //Log.send("****** INSIDE LoadDeckInfoStep");
        var _ = new LogicalUtils();
        var playerUUID = _.ResolveVariable(this.logicalBufferReferencePlayerUUID, logicalBuffer);
        var requestedInfo = null;
        var deckSize = GameDTOAccess.getCardsInZone(gameDTO, playerUUID, Zones.DECK).length;
        if (this.option instanceof LoadDeckStepCardAtIndexFromTopOption) {
            var cardsOnDeck = GameDTOAccess.getCardsOnDeck(gameDTO, playerUUID, 1 + this.option.indexFromTop);
            requestedInfo = cardsOnDeck[cardsOnDeck.length - 1];
        }
        else {
            if (this.option == LoadDeckInfoStepOptions.TOP_CARD) {
                requestedInfo = GameDTOAccess.getCardsOnDeck(gameDTO, playerUUID, 1)[0];
            }
            else if (this.option == LoadDeckInfoStepOptions.DECK_SIZE) {
                //Log.send("Deck size requested: " + deckSize);
                requestedInfo = deckSize;
            }
        }
        logicalBuffer.storedData[this.logicalBufferReturnKey] = requestedInfo;
        return true;
    }
    reset() {
    }
    getStepId() {
        return StepId.LOAD_DECK;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        if (Util.isNumber(dto.args["option"])) {
            this.option = dto.args["option"];
        }
        else {
            this.option = new LoadDeckStepCardAtIndexFromTopOption(JSON.parse(dto.args["option"])["indexFromTop"]);
        }
        this.logicalBufferReferencePlayerUUID = LogicalVariable.generateFromDTO(dto.args["logicalBufferReferencePlayerUUID"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
    }
    convertToDTO() {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        if (this.option instanceof LoadDeckStepCardAtIndexFromTopOption) {
            dto.args["option"] = JSON.stringify(this.option);
        }
        else {
            dto.args["option"] = this.option;
        }
        dto.args["logicalBufferReferencePlayerUUID"] = this.logicalBufferReferencePlayerUUID.convertToDTO();
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        return dto;
    }
    hasSubsteps() {
        return false;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return this;
    }
}
RegisterEventBufferStep(LoadDeckInfoStep);
///<reference path="../LogicalStep.ts" />
var LoadHandInfoStepOptions;
(function (LoadHandInfoStepOptions) {
    LoadHandInfoStepOptions[LoadHandInfoStepOptions["ALL"] = 0] = "ALL";
    LoadHandInfoStepOptions[LoadHandInfoStepOptions["SIZE"] = 1] = "SIZE";
})(LoadHandInfoStepOptions || (LoadHandInfoStepOptions = {}));
class LoadHandInfoStep extends LogicalStep {
    constructor(option, logicalBufferReferencePlayerUUID, logicalBufferReturnKey) {
        super();
        this.option = option;
        this.logicalBufferReferencePlayerUUID = logicalBufferReferencePlayerUUID;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        var _ = new LogicalUtils();
        var playerUUID = _.ResolveVariable(this.logicalBufferReferencePlayerUUID, logicalBuffer);
        var requestedInfo = null;
        if (this.option == LoadHandInfoStepOptions.SIZE) {
            requestedInfo = GameDTOAccess.getCardsInZone(gameDTO, playerUUID, Zones.HAND).length;
            //Log.send("Hand size requested: " + requestedInfo);
        }
        else if (this.option == LoadHandInfoStepOptions.ALL) {
            requestedInfo = GameDTOAccess.getCardsInZone(gameDTO, playerUUID, Zones.HAND);
        }
        logicalBuffer.storedData[this.logicalBufferReturnKey] = requestedInfo;
        return true;
    }
    getStepId() {
        return StepId.LOAD_HAND;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.option = dto.args["option"];
        this.logicalBufferReferencePlayerUUID = LogicalVariable.generateFromDTO(dto.args["logicalBufferReferencePlayerUUID"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
    }
    convertToDTO() {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["option"] = this.option;
        dto.args["logicalBufferReferencePlayerUUID"] = this.logicalBufferReferencePlayerUUID.convertToDTO();
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        return dto;
    }
    reset() {
    }
    hasSubsteps() {
        return false;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return this;
    }
}
RegisterEventBufferStep(LoadHandInfoStep);
class LoopStep extends LogicalStep {
    constructor(amount, stepsToLoop) {
        super();
        this.amount = amount;
        this.stepsToLoop = stepsToLoop;
        this.currentLoopIteration = 0;
        this.currentSubstepIndex = 0;
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        var _ = new LogicalUtils();
        var amountValue = _.ResolveVariable(this.amount, logicalBuffer);
        var currentStep = this.stepsToLoop[this.currentSubstepIndex];
        var isSubStepComplete = currentStep.processAndAdvance(logicalBuffer, gameDTO);
        if (isSubStepComplete) {
            this.currentSubstepIndex++;
        }
        if (this.currentSubstepIndex >= this.stepsToLoop.length) {
            this.currentLoopIteration++;
            if (this.currentLoopIteration >= amountValue) {
                return true;
            }
            else {
                this.currentSubstepIndex = 0;
                this.stepsToLoop.forEach((eachStep) => {
                    eachStep.reset();
                });
                return false;
            }
        }
    }
    reset() {
        this.currentSubstepIndex = 0;
        this.currentSubstepIndex = 0;
        this.stepsToLoop.forEach((eachStep) => {
            eachStep.reset();
        });
    }
    getStepId() {
        return StepId.LOOP;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.currentLoopIteration = dto.args["currentLoopIteration"];
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
        this.amount = LogicalVariable.generateFromDTO(dto.args["amount"]);
        this.stepsToLoop = [];
        for (var key in dto.args["stepsToLoop"]) {
            this.stepsToLoop[key] = LogicalStep.createFromDTO(dto.args["stepsToLoop"][key], logicalBuffer, gameDTO);
        }
    }
    convertToDTO() {
        var _ = new LogicalUtils();
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["currentLoopIteration"] = this.currentLoopIteration;
        dto.args["currentSubstepIndex"] = this.currentSubstepIndex;
        dto.args["amount"] = this.amount;
        dto.args["stepsToLoop"] = _.SerializeDTOArray(this.stepsToLoop);
        return dto;
    }
    hasSubsteps() {
        return true;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return this.stepsToLoop[this.currentSubstepIndex];
    }
}
RegisterEventBufferStep(LoopStep);
var MathStepOptions;
(function (MathStepOptions) {
    MathStepOptions[MathStepOptions["MIN"] = 0] = "MIN";
})(MathStepOptions || (MathStepOptions = {}));
class MathStep extends LogicalStep {
    constructor(logicalBufferReferenceArguments, option, logicalBufferReturnKey) {
        super();
        this.option = option;
        this.logicalBufferReferenceArguments = logicalBufferReferenceArguments;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        var _ = new LogicalUtils();
        var result = null;
        if (this.option == MathStepOptions.MIN) {
            var resolvedArgs = [];
            this.logicalBufferReferenceArguments.forEach((eachArg) => {
                resolvedArgs.push(_.ResolveVariable(eachArg, logicalBuffer));
            });
            result = Math.min(...resolvedArgs);
        }
        logicalBuffer.storedData[this.logicalBufferReturnKey] = result;
        return true;
    }
    getStepId() {
        return StepId.MATH;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.option = dto.args["option"];
        this.logicalBufferReferenceArguments = [];
        dto.args["logicalBufferReferenceArguments"].forEach((eachArg) => {
            this.logicalBufferReferenceArguments.push(LogicalVariable.generateFromDTO(eachArg));
        });
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
    }
    convertToDTO() {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["option"] = this.option;
        dto.args["logicalBufferReferenceArguments"] = [];
        this.logicalBufferReferenceArguments.forEach((eachArg) => {
            dto.args["logicalBufferReferenceArguments"].push(eachArg.convertToDTO());
        });
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        return dto;
    }
    reset() {
    }
    hasSubsteps() {
        return false;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return this;
    }
}
RegisterEventBufferStep(MathStep);
///<reference path="../LogicalStep.ts" />
var PlayerChoiceType;
(function (PlayerChoiceType) {
    PlayerChoiceType[PlayerChoiceType["CARD"] = 0] = "CARD";
    PlayerChoiceType[PlayerChoiceType["STRING"] = 1] = "STRING";
})(PlayerChoiceType || (PlayerChoiceType = {}));
var PlayerChoicePrepositionValues;
(function (PlayerChoicePrepositionValues) {
    PlayerChoicePrepositionValues[PlayerChoicePrepositionValues["EXACTLY"] = 0] = "EXACTLY";
    PlayerChoicePrepositionValues[PlayerChoicePrepositionValues["UP_TO"] = 1] = "UP_TO";
})(PlayerChoicePrepositionValues || (PlayerChoicePrepositionValues = {}));
class PlayerChoicePreposition {
    constructor(type, value) {
        this.value = value;
        this.type = type;
    }
}
class PlayerChoiceStep extends LogicalStep {
    constructor(playerUUID, choiceType, options, preposition, logicalBufferReturnKey, displayText) {
        super();
        this.hasBeenFulfilled = false;
        this.playerUUID = playerUUID;
        this.choiceType = choiceType;
        this.options = options;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
        this.preposition = preposition;
        this.displayText = displayText;
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        /*var _ = new LogicalUtils();
        PlayerChoiceNotify.send(_.ResolveVariable(this.playerUUID, logicalBuffer), _.ResolveVariable(this.options, logicalBuffer), this.preposition.type, _.ResolveVariable(this.preposition.value, logicalBuffer));
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.fname(_.ResolveVariable(this.playerUUID, logicalBuffer)) + " chooses " + logicalBuffer.storedData[this.logicalBufferReturnKey]);
        var stack = GameDTOAccess.getLogicalStack(gameDTO);
        var topBuffer = stack.buffers[stack.buffers.length - 1];
        var currentStep = GameDTOAccess.traverseLogicalStep(gameDTO, topBuffer, topBuffer.getCurrentStep());*/
        var lu = new LoggingUtils(gameDTO);
        var _ = new LogicalUtils();
        if (this.hasBeenFulfilled) {
            Log.send(lu.fname(_.ResolveVariable(this.playerUUID, logicalBuffer)) + " chooses " + logicalBuffer.storedData[this.logicalBufferReturnKey]);
            return true;
        }
        else {
            GameDTOAccess.setState(gameDTO, GameState.WAITING_FOR_PLAYER_CHOICE);
            return false;
        }
    }
    fulfill(answers, logicalBuffer, gameDTO) {
        if (answers.length == 1) {
            logicalBuffer.storedData[this.logicalBufferReturnKey] = answers[0];
        }
        else {
            logicalBuffer.storedData[this.logicalBufferReturnKey] = answers;
        }
        this.hasBeenFulfilled = true;
        GameDTOAccess.updateLogicalBuffer(gameDTO, logicalBuffer);
    }
    getStepId() {
        return StepId.PLAYER_CHOICE;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.playerUUID = LogicalVariable.generateFromDTO(dto.args["playerUUID"]);
        this.choiceType = dto.args["choiceType"];
        this.options = LogicalVariable.generateFromDTO(dto.args["options"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
        this.preposition = dto.args["preposition"];
        this.hasBeenFulfilled = dto.args["hasBeenFulfilled"];
        this.displayText = dto.args["displayText"];
    }
    convertToDTO() {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["choiceType"] = this.choiceType;
        dto.args["playerUUID"] = this.playerUUID;
        dto.args["options"] = this.options;
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        dto.args["preposition"] = this.preposition;
        dto.args["hasBeenFulfilled"] = this.hasBeenFulfilled;
        dto.args["displayText"] = this.displayText;
        return dto;
    }
    reset() {
        this.hasBeenFulfilled = false;
    }
    hasSubsteps() {
        return false;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return null;
    }
}
RegisterEventBufferStep(PlayerChoiceStep);
///<reference path="../LogicalStep.ts" />
var QueryStepOptions;
(function (QueryStepOptions) {
    QueryStepOptions[QueryStepOptions["NOT_IN"] = 0] = "NOT_IN";
    QueryStepOptions[QueryStepOptions["IN"] = 1] = "IN";
})(QueryStepOptions || (QueryStepOptions = {}));
class QueryStep extends LogicalStep {
    constructor(setOne, option, setTwo, logicalBufferReturnKey) {
        super();
        this.setOne = setOne;
        this.setTwo = setTwo;
        this.option = option;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        var _ = new LogicalUtils();
        var firstOpValue = _.ResolveVariable(this.setOne, logicalBuffer);
        var secondOpValue = _.ResolveVariable(this.setTwo, logicalBuffer);
        firstOpValue = Util.convertToArray(firstOpValue);
        secondOpValue = Util.convertToArray(secondOpValue);
        var queryEval = [];
        if (this.option == QueryStepOptions.NOT_IN) {
            secondOpValue.forEach((innerEach) => {
                if (firstOpValue.indexOf(innerEach) == -1) {
                    queryEval.push(innerEach);
                }
            });
        }
        else if (this.option == QueryStepOptions.IN) {
            secondOpValue.forEach((innerEach) => {
                if (firstOpValue.indexOf(innerEach) != -1) {
                    queryEval.push(innerEach);
                }
            });
        }
        logicalBuffer.storedData[this.logicalBufferReturnKey] = queryEval;
        return true;
    }
    reset() {
    }
    getStepId() {
        return StepId.QUERY;
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.setOne = LogicalVariable.generateFromDTO(dto.args["setOne"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
        this.setTwo = LogicalVariable.generateFromDTO(dto.args["setTwo"]);
        this.option = dto.args["option"];
    }
    convertToDTO() {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["setOne"] = this.setOne;
        dto.args["option"] = this.option;
        dto.args["setTwo"] = this.setTwo;
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        return dto;
    }
    hasSubsteps() {
        return false;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return null;
    }
}
RegisterEventBufferStep(QueryStep);
///<reference path="../LogicalStep.ts" />
var RelationalOptions;
(function (RelationalOptions) {
    RelationalOptions[RelationalOptions["GREATER_THAN_EQ"] = 0] = "GREATER_THAN_EQ";
    RelationalOptions[RelationalOptions["LESS_THAN"] = 1] = "LESS_THAN";
    RelationalOptions[RelationalOptions["EQUALS"] = 2] = "EQUALS";
    RelationalOptions[RelationalOptions["GREATER_THAN"] = 3] = "GREATER_THAN";
    RelationalOptions[RelationalOptions["NOT_EQ"] = 4] = "NOT_EQ";
})(RelationalOptions || (RelationalOptions = {}));
class RelationalStep extends LogicalStep {
    constructor(firstOperand, relationalOption, secondOperand, stepsToPerform) {
        super();
        this.firstOperand = firstOperand;
        this.relationalOption = relationalOption;
        this.secondOperand = secondOperand;
        this.stepsToPerform = stepsToPerform;
        this.currentSubstepIndex = 0;
    }
    processAndAdvance(logicalBuffer, gameDTO) {
        //alert("inside relational step");
        this.hasBeenReset = false;
        var _ = new LogicalUtils();
        var firstOpValue = _.ResolveVariable(this.firstOperand, logicalBuffer);
        var secondOpValue = _.ResolveVariable(this.secondOperand, logicalBuffer);
        var relationalEval = null;
        if (this.relationalOption == RelationalOptions.GREATER_THAN_EQ) {
            relationalEval = firstOpValue >= secondOpValue;
        }
        else if (this.relationalOption == RelationalOptions.LESS_THAN) {
            relationalEval = firstOpValue < secondOpValue;
        }
        else if (this.relationalOption == RelationalOptions.EQUALS) {
            relationalEval = firstOpValue == secondOpValue;
        }
        else if (this.relationalOption == RelationalOptions.NOT_EQ) {
            relationalEval = firstOpValue != secondOpValue;
        }
        else if (this.relationalOption == RelationalOptions.GREATER_THAN) {
            relationalEval = firstOpValue > secondOpValue;
        }
        if (relationalEval) {
            var currentStep = this.stepsToPerform[this.currentSubstepIndex];
            var isSubStepComplete = currentStep.processAndAdvance(logicalBuffer, gameDTO);
            if (this.hasBeenReset) {
                this.hasBeenReset = false;
            }
            else {
                if (isSubStepComplete) {
                    this.currentSubstepIndex++;
                }
                if (this.currentSubstepIndex >= this.stepsToPerform.length) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }
    getStepId() {
        return StepId.RELATIONAL;
    }
    reset() {
        this.hasBeenReset = true;
        this.currentSubstepIndex = 0;
        this.stepsToPerform.forEach((eachStep) => {
            eachStep.reset();
        });
    }
    constructFromDTO(dto, logicalBuffer, gameDTO) {
        this.uuid = dto.uuid;
        this.firstOperand = LogicalVariable.generateFromDTO(dto.args["firstOperand"]);
        this.secondOperand = LogicalVariable.generateFromDTO(dto.args["secondOperand"]);
        this.relationalOption = dto.args["relationalOption"];
        this.stepsToPerform = [];
        for (var key in dto.args["stepsToPerform"]) {
            this.stepsToPerform[key] = LogicalStep.createFromDTO(dto.args["stepsToPerform"][key], logicalBuffer, gameDTO);
        }
        this.currentSubstepIndex = dto.args["currentSubstepIndex"];
        this.hasBeenReset = dto.args["hasBeenReset"];
    }
    convertToDTO() {
        var _ = new LogicalUtils();
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        dto.args["firstOperand"] = this.firstOperand;
        dto.args["relationalOption"] = this.relationalOption;
        dto.args["secondOperand"] = this.secondOperand;
        dto.args["stepsToPerform"] = _.SerializeDTOArray(this.stepsToPerform);
        dto.args["currentSubstepIndex"] = this.currentSubstepIndex;
        dto.args["hasBeenReset"] = this.hasBeenReset;
        return dto;
    }
    hasSubsteps() {
        return true;
    }
    getCurrentSubstep(logicalBuffer, gameDTO) {
        return this.stepsToPerform[this.currentSubstepIndex];
    }
}
RegisterEventBufferStep(RelationalStep);
class Reaction {
    constructor(status, canActivate, effectLogic) {
        this.validStatusCheck = status;
        this.canActivate = canActivate;
        this.effectLogic = effectLogic;
    }
}
class ReactionBuffer {
    constructor(eventUUID, eventStatus, entries) {
        this.eventUUID = eventUUID;
        this.eventStatus = eventStatus;
        this.entries = entries;
    }
    processAndAdvance(gameDTO) {
        var topReaction = this.entries[this.entries.length - 1];
        var event = GameDTOAccess.getEvent(gameDTO, this.eventUUID);
        ReactionBuffer.GetReactiveComponent(gameDTO, topReaction).getReactions().forEach((eachReaction) => {
            if (eachReaction.canActivate(event, gameDTO)) {
                eachReaction.effectLogic(event, gameDTO);
            }
        });
        this.entries.pop();
        if (this.entries.length <= 0) {
            return true;
        }
        return false;
    }
    convertToDTO() {
        var dto = new GameDTO_ReactionBuffer();
        dto.eventUUIDReactingTo = this.eventUUID;
        dto.eventStatus = this.eventStatus;
        dto.potentialReactions = this.entries;
        return dto;
    }
    static pollReactions(event, gameDTO) {
        var result = [];
        for (var key in ReactionBuffer.REACTIVES_COMPONENTS) {
            var reactionEntry = ReactionBuffer.REACTIVES_COMPONENTS[key](gameDTO).getReactions();
            reactionEntry.forEach((eachReaction) => {
                if (eachReaction.validStatusCheck == event.status) {
                    var dto = GameDTOAccess.getCardDTO(gameDTO, ReactionKey.fromString(key).id);
                    if (eachReaction.canActivate(event, gameDTO)) {
                        var dto = GameDTOAccess.getCardDTO(gameDTO, ReactionKey.fromString(key).id);
                        result.push(ReactionKey.fromString(key));
                    }
                }
            });
        }
        return result;
    }
}
ReactionBuffer.REACTIVES_COMPONENTS = {};
ReactionBuffer.RegisterReactiveComponent = (key, component) => {
    var strKey = JSON.stringify(key);
    ReactionBuffer.REACTIVES_COMPONENTS[strKey] = (gameDTO) => {
        return component(gameDTO, key.id);
    };
};
ReactionBuffer.GetReactiveComponent = (gameDTO, key) => {
    var cardDTO = GameDTOAccess.getCardDTO(gameDTO, key.id);
    return ReactionBuffer.REACTIVES_COMPONENTS[JSON.stringify(key)](gameDTO);
};
class ReactionKey {
    constructor(type, id) {
        this.type = type;
        this.id = id;
    }
    static fromString(str) {
        var obj = JSON.parse(str);
        var newKey = new ReactionKey(obj["type"], obj["id"]);
        return newKey;
    }
}
var ReactionSourceType;
(function (ReactionSourceType) {
    ReactionSourceType[ReactionSourceType["CARD"] = 0] = "CARD";
    ReactionSourceType[ReactionSourceType["SYSTEM"] = 1] = "SYSTEM";
})(ReactionSourceType || (ReactionSourceType = {}));
class ReactionStack {
    processAndAdvance(gameDTO) {
        ReactionStack.currentOutput = new ReactionStackOutput();
        var topBuffer = this.buffers[this.buffers.length - 1];
        var isComplete = topBuffer.processAndAdvance(gameDTO);
        if (isComplete) {
            GameDTOAccess.removeTopReactionBuffer(gameDTO);
            ReactionStack.currentOutput.currentBufferFinished = true;
        }
        if (this.buffers.length <= 0) {
            ReactionStack.currentOutput.isEmpty = true;
        }
        return ReactionStack.currentOutput;
    }
}
class ReactionStackOutput {
}
class CleanUpReaction {
    constructor() {
        this.reactions = [];
        this.reactions.push(new Reaction(EventStatus.RESOLVED, (event, gameDTO) => {
            if (event.getId() == EventIds.ADVANCE_PHASE && gameDTO.state.phase == Phase.CLEAN_UP) {
                return true;
            }
            return false;
        }, (event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicBuffer = new LogicalBuffer();
            var hand = GameDTOAccess.getCardsInZone(gameDTO, gameDTO.state.turnPlayer, Zones.HAND);
            var inPlay = GameDTOAccess.getCardsInZone(gameDTO, gameDTO.state.turnPlayer, Zones.IN_PLAY);
            var allCards = hand.concat(inPlay);
            var moneyToReduce = GameDTOAccess.getPlayerFromUUID(gameDTO, gameDTO.state.turnPlayer).turn.money * -1;
            logicBuffer.addSteps(new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(gameDTO.state.turnPlayer), _.Value(moneyToReduce))), new ForEachStep(_.Value(allCards), "each_card_chosen", [
                new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("each_card_chosen")))
            ]), new DrawCardsStep(gameDTO.state.turnPlayer, _.Value(5)));
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicBuffer);
        }));
    }
    getReactions() {
        return this.reactions;
    }
}
ReactionBuffer.RegisterReactiveComponent(new ReactionKey(ReactionSourceType.SYSTEM, "CleanUpReaction"), (gameDTO, uuid) => { return new CleanUpReaction(); });
class DriverNotify {
    static ping() {
        MessagingCenter.notify(DriverNotify.DRIVER_EVENT, {});
    }
    static subscribe(callback) {
        MessagingCenter.addListener(DriverNotify.DRIVER_EVENT, callback, false);
    }
}
DriverNotify.DRIVER_EVENT = "DRIVER_EVENT";
class GameDisplayFeed {
    static send(gameDTO, action) {
        MessagingCenter.notify(GameDisplayFeed.GAME_FEED_EVENT, {
            "gameDTO": gameDTO,
            "action": action
        });
    }
    static subscribe(callback) {
        MessagingCenter.addListener(GameDisplayFeed.GAME_FEED_EVENT, (message) => {
            callback(message["gameDTO"], message["action"]);
        }, false);
    }
}
GameDisplayFeed.GAME_FEED_EVENT = "GAME_FEED_EVENT";
class MessagingCenter {
    static addListener(event, callback, removeOnCompletion) {
        if (MessagingCenter.pubSubMap[event] == null) {
            MessagingCenter.pubSubMap[event] = [];
        }
        MessagingCenter.pubSubMap[event].push(new MessageCallback(callback, removeOnCompletion, MessagingCenter.pubSubMap[event].length));
    }
    static notify(event, payload) {
        if (MessagingCenter.pubSubMap[event] != null) {
            MessagingCenter.pubSubMap[event].forEach((e, eIdx) => {
                e.callback(payload);
                if (e.removeOnCompletion) {
                    MessagingCenter.pubSubMap[event].splice(eIdx, 1);
                }
            });
        }
    }
}
MessagingCenter.pubSubMap = {};
///<reference path="MessagingCenter.ts" />
class Log {
    static send(messageString) {
        MessagingCenter.notify(Log.LOG_EVENT, {
            "message": messageString
        });
    }
    static subscribe(callback) {
        MessagingCenter.addListener(Log.LOG_EVENT, callback, false);
    }
}
Log.LOG_EVENT = "LOG_EVENT";
class MessageCallback {
    constructor(callback, removeOnCompletion, id) {
        this.callback = callback;
        this.removeOnCompletion = removeOnCompletion;
        this.id = id;
    }
}
class PlayerChoiceNotify {
    static send(playerUUID, options, prepositionType, prepositionValue) {
        MessagingCenter.notify(PlayerChoiceNotify.PLAYER_CHOICE, {
            "playerUUID": playerUUID,
            "options": options,
            "prepositionType": prepositionType,
            "prepositionValue": prepositionValue
        });
    }
    static subscribe(callback) {
        MessagingCenter.addListener(PlayerChoiceNotify.PLAYER_CHOICE, (message) => {
            callback(message["playerUUID"], message["options"], message["prepositionType"], message["prepositionValue"]);
        }, false);
    }
}
PlayerChoiceNotify.PLAYER_CHOICE = "PLAYER_CHOICE";
class TurnNotify {
    static send(turnPlayer) {
        MessagingCenter.notify(TurnNotify.TURN_EVENT, {
            "turnPlayer": turnPlayer
        });
    }
    static subscribe(callback) {
        MessagingCenter.addListener(TurnNotify.TURN_EVENT, (message) => {
            callback(message["turnPlayer"]);
        }, false);
    }
}
TurnNotify.TURN_EVENT = "TURN_EVENT";
class LoggingUtils {
    constructor(gameDTO) {
        this.gameDTO = gameDTO;
    }
    fname(objectUUID) {
        var dto = GameDTOAccess.getObjectForUUID(this.gameDTO, objectUUID);
        if (dto instanceof GameDTO_Card) {
            return CardIds[dto.definitionId];
        }
        else if (dto instanceof GameDTO_Player) {
            return dto.name;
        }
    }
    owner(cardUUID) {
        var ownerDto = GameDTOAccess.getOwnerDTO(this.gameDTO, cardUUID);
        return ownerDto.name;
    }
}
function UUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
class Util {
    static contains(a, obj) {
        var i = a.length;
        while (i--) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }
    static shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    static randomInRange(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static isArray(obj) {
        return !!obj && obj.constructor === Array;
    }
    static convertToArray(value) {
        if (!Util.isArray(value)) {
            var newArray = [];
            newArray.push(value);
            return newArray;
        }
        return value;
    }
    static isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0); }
}
