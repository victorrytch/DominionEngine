class CouncilRoomCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();

            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new DrawCardsStep(__this.cardState.ownerUUID, _.Value(4)),
                new EventGeneratorStep(EventIds.ADD_BUYS, new AddBuysEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1)))
            );


            GameDTOAccess.getPlayers(gameDTO).forEach((value) => {
                if (value.uuid != __this.cardState.ownerUUID) {
                    logicalBuffer.addStep(
                        new DrawCardsStep(value.uuid, _.Value(1))
                    );
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
        return CardIds.COUNCIL_ROOM;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }



}

RegisterCard(CouncilRoomCardDefinition);