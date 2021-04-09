class RemodelCardDefinition extends CardDefinition {

    setReactions(): void {
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
                })
                conditionMap[value] = [];
                conditionMap[value].push(new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(options), _.Exactly(_.Value(1)), "gained_card", "Choose a card to gain."));
                conditionMap[value].push(new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(__this.cardState.ownerUUID), _.Reference("gained_card"))));
            });


            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(trashOptions), _.Exactly(_.Value(1)), "trashed_card", "Choose a card to trash."),
                new EventGeneratorStep(EventIds.TRASH_CARD, new TrashCardsEventArgs(_.Reference("trashed_card"))),
                new ConditionalStep(_.Reference("trashed_card"), conditionMap)
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
        return CardIds.REMODEL;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }

}

RegisterCard(RemodelCardDefinition);