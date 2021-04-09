class WitchCardDefinition extends CardDefinition {

    setReactions() {
        var __this = this;

        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new DrawCardsStep(__this.cardState.ownerUUID, _.Value(2))
            );

            GameDTOAccess.getPlayers(gameDTO).forEach((value) => {
                if (value.uuid != __this.cardState.ownerUUID) {
                    if (!GameDTOAccess.isPlayerUnaffectedByCard(gameDTO, value.uuid, __this.cardState.uuid)) {
                        var nextCurse = GameDTOAccess.getNextCardInSupplyPile(gameDTO, CardIds.CURSE);

                        if (nextCurse != null) {

                            logicalBuffer.addSteps(
                                new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(value.uuid), _.Value(nextCurse)))
                            );

                        }
                    }
                }
            });
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
        return CardIds.WITCH;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION, CardType.ATTACK];
    }

}

RegisterCard(WitchCardDefinition);

