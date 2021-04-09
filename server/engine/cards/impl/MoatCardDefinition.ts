class MoatCardDefinition extends CardDefinition {


    setReactions() {
        var __this = this;
        this.addOnPlay((event, gameDTO) => {
            var _ = new LogicalUtils();
            var logicalBuffer = new LogicalBuffer();
            logicalBuffer.addSteps(
                new DrawCardsStep(__this.cardState.ownerUUID, _.Value(2))
            );
            GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicalBuffer);
        });

        this.reactions.push(new Reaction(
            EventStatus.DECLARED,
            (event: GameEvent, gameDTO: GameDTO) => {
                if (event.getId() == EventIds.CARD_PLAYED &&
                    event.eventSourceUUID != __this.cardState.ownerUUID &&
                    GameDTOAccess.getCardDefinition(gameDTO, event.args[CardPlayedEvent.CARD_UUID]).hasType(CardType.ATTACK)) {
                    return true;
                }
                return false;
            },
            (event: GameEvent, gameDTO) => {
                var _ = new LogicalUtils();
                var logicalBuffer = new LogicalBuffer();
                logicalBuffer.addStep(
                    new PlayerChoiceStep(_.Value(__this.cardState.ownerUUID), PlayerChoiceType.STRING, _.Value(["Yes", "No"]), _.Exactly(_.Value(1)), "revealMoatDecision", "Reveal MOAT?")
                );
                logicalBuffer.addStep(
                    new ConditionalStep(_.Reference("revealMoatDecision"), {
                        "Yes": [
                            new EventGeneratorStep(EventIds.REVEAL_CARD, new RevealCardEventArgs(_.Value(__this.cardState.uuid))),
                            new EventGeneratorStep(EventIds.SET_UNAFFECTED, new SetUnaffectedEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(event.args[CardPlayedEvent.CARD_UUID]), _.Value(SetUnaffectedEventAction.SET)))
                        ]
                    }));
            }
        ));

        this.reactions.push(new Reaction(
            EventStatus.RESOLVED,
            (event: GameEvent, gameDTO: GameDTO) => {
                if (event.getId() == EventIds.CARD_PLAYED && event.eventSourceUUID != GameDTOAccess.getOwner(gameDTO, __this.cardState.uuid) && GameDTOAccess.getCardDefinition(gameDTO, event.args[CardPlayedEvent.CARD_UUID]).hasType(CardType.ATTACK)) {
                    return true;
                }
                return false;
            },
            (event, gameDTO) => {
                var _ = new LogicalUtils();
                var logicalBuffer = new LogicalBuffer();
                logicalBuffer.addStep(
                    new EventGeneratorStep(EventIds.SET_UNAFFECTED, new SetUnaffectedEventArgs(_.Value(__this.cardState.ownerUUID), _.Value(event.args[CardPlayedEvent.CARD_UUID]), _.Value(SetUnaffectedEventAction.REMOVE)))
                );
            
            }
        ));


    }


    getCost(): number {
        return 2;
    }

    getVictoryPoints(gameDTO: GameDTO): number {
        return 0;
    }

    getCardId(): number {
        return CardIds.MOAT;
    }

    getCardTypes(): CardType[] {
        return [CardType.ACTION, CardType.REACTION];
    }

}

RegisterCard(MoatCardDefinition);