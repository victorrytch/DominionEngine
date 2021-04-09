class MineCardDefinition extends CardDefinition {

    setReactions(): void {
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
                    })
                    conditionMap[value] = [];
                    conditionMap[value].push(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(options), _.Exactly(_.Value(1)), "gained_card", "Choose a treasure to gain."));
                    conditionMap[value].push(new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(__this.cardState.ownerUUID), _.Reference("gained_card"), _.Value(Zones.HAND))));
                });


                logicalBuffer.addSteps(
                    new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(trashOptions), _.UpTo(_.Value(1)), "trashed_card", "Choose a treasure to trash."),
                    new CountStep(_.Reference("trashed_card"), "chosen_trashed_card_count"),
                    new RelationalStep(_.Reference("chosen_trashed_card_count"), RelationalOptions.GREATER_THAN, _.Value(0), [
                        new EventGeneratorStep(EventIds.TRASH_CARD, new TrashCardsEventArgs(_.Reference("trashed_card"))),
                        new ConditionalStep(_.Reference("trashed_card"), conditionMap)
                    ])
                );
            }

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
        return CardIds.MINE;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }


}

RegisterCard(MineCardDefinition);