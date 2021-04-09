class ThroneRoomCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {

            var actionsInHand = GameDTOAccess.getCardsInZone(gameDTO, __this.cardState.ownerUUID, Zones.HAND).filter((value) => {
                return Util.contains(GameDTOAccess.getCardDefinition(gameDTO, value).getCardTypes(), CardType.ACTION);
            });

            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();

            if (actionsInHand.length > 0) {
                logicalBuffer.addStep(
                    new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(actionsInHand), _.Exactly(_.Value(1)), "chosen_card", "Choose a card to play twice.")
                );

                for (var i = 0; i < 2; i++) {
                    logicalBuffer.addStep(
                        new EventGeneratorStep(EventIds.CARD_PLAYED, new CardPlayedEventArgs(_.Reference("chosen_card")))
                    );
                }
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
        return CardIds.THRONE_ROOM;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }


}

RegisterCard(ThroneRoomCardDefinition);