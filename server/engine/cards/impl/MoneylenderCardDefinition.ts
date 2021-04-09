class MoneylenderCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {

            var coppers = GameDTOAccess.getCardsInZone(gameDTO, __this.cardState.ownerUUID, Zones.HAND).filter((eachCardInHand) => {
                return GameDTOAccess.getCardDefinition(gameDTO, eachCardInHand).getCardId() == CardIds.COPPER;
            });

            var _ = new LogicalUtils();

            var logicalBuffer = new LogicalBuffer();

            if (coppers.length > 0) {
                logicalBuffer.addSteps(
                    new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(["Yes", "No"]), _.Exactly(_.Value(1)), "trash_copper_decision", "Choose a COPPER to trash."),
                    new ConditionalStep(_.Reference("trash_copper_decision"), {
                        "Yes": [
                            new EventGeneratorStep(EventIds.TRASH_CARD, new TrashCardsEventArgs(_.Value(coppers[0]))),
                            new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(3)))
                        ]
                    })
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
        return CardIds.MONEYLENDER;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }

}

RegisterCard(MoneylenderCardDefinition);