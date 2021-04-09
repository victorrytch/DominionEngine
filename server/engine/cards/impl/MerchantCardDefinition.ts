class MerchantCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new DrawCardsStep(__this.cardState.ownerUUID, _.Value(1)),
                new EventGeneratorStep(EventIds.ADD_ACTION, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1)))
            );
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });

        this.reactions.push(new Reaction(
            EventStatus.RESOLVED,
            (event: GameEvent, gameDTO: GameDTO) => {
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
            },
            (event, gameDTO) => {
                var lu = new LoggingUtils(gameDTO);
                Log.send(lu.fname(__this.cardState.ownerUUID) + " recieved +1 money from MERCHANT");
                var _ = new LogicalUtils();
                var logicalBuffer = new LogicalBuffer();
                logicalBuffer.addSteps(
                    new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(1)))
                );
                GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
            }
        ));
    }


    getCost(): number {
        return 3;
    }

    getVictoryPoints(gameDTO: GameDTO): number {
        return 0;
    }

    getCardId(): number {
        return CardIds.MERCHANT;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION];
    }

}

RegisterCard(MerchantCardDefinition);