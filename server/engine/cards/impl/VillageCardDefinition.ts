class VillageCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new DrawCardsStep(__this.cardState.ownerUUID, _.Value(1)),
                new EventGeneratorStep(EventIds.ADD_ACTION, new AddActionEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(2)))
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
        return CardIds.VILLAGE;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }


}


RegisterCard(VillageCardDefinition);