class BureaucratCardDefinition extends CardDefinition {

    setReactions(): void {
        var __this = this;

        this.addOnPlay((event, gameDTO) => {
            var silverCardUUID = GameDTOAccess.getNextCardInSupplyPile(gameDTO, CardIds.SILVER);

            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new EventGeneratorStep(EventIds.GAIN_CARD, new GainCardEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(silverCardUUID)))
            );


            GameDTOAccess.getPlayers(gameDTO).forEach((value) => {
                if (value.uuid != __this.cardState.ownerUUID) {
                    if (!GameDTOAccess.isPlayerUnaffectedByCard(gameDTO, value.uuid, __this.cardState.uuid)) {

                        var victoriesInHand = GameDTOAccess.getVictoriesInHand(gameDTO, value.uuid);

                        if (victoriesInHand.length > 0) {
                            logicalBuffer.addSteps(
                                new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.CARD, _.Value(GameDTOAccess.getVictoriesInHand(gameDTO, value.uuid)), _.Exactly(_.Value(1), "Choose card to place on deck."), "chosen_card"),
                                new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Reference("chosen_card"))),
                                new EventGeneratorStep(EventIds.PLACE_IN_DECK, new PlaceInDeckEventArgs(_.Reference("chosen_card"), _.Value(PlaceInDeckEventOptions.TOP)))
                            );
                        }


                    }
                }
            });
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });



    }

    getCost(): number {
        return 4;
    }

    getVictoryPoints(): number {
        return 0;
    }


    getCardId(): number {
        return CardIds.BUREAUCRAT;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION, CardType.ATTACK];
    }

}

RegisterCard(BureaucratCardDefinition);