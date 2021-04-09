class FestivalCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new EventGeneratorStep(EventIds.ADD_ACTION, new AddActionEventArgs(_.Value(this.cardState.ownerUUID), _.Value(2))),
                new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1))),
                new EventGeneratorStep(EventIds.ADD_BUYS, new AddBuysEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1)))
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
        return CardIds.FESTIVAL;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }


}

RegisterCard(FestivalCardDefinition);