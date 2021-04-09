class CopperCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1)))
            );
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });
    }


    getCost(): number {
        return 0;
    }

    getVictoryPoints(): number {
        return 0;
    }

    getCardId(): number {
        return CardIds.COPPER;
    }

    getCardTypes(): CardType[] {
        return [CardType.TREASURE];
    }


}

RegisterCard(CopperCardDefinition);

