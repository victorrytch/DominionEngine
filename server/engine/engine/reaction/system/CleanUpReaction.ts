class CleanUpReaction implements Reactive {

    reactions: Reaction[] = [];

    getReactions(): Reaction[] {
        return this.reactions;
    }

    constructor() {
        this.reactions.push(new Reaction(
            EventStatus.RESOLVED,
            (event: GameEvent, gameDTO: GameDTO) => {
                if (event.getId() == EventIds.ADVANCE_PHASE && gameDTO.state.phase == Phase.CLEAN_UP) {
                    return true;
                }
                return false;
            },
            (event: GameEvent, gameDTO: GameDTO) => {
                var _ = new LogicalUtils();
                var logicBuffer = new LogicalBuffer();

                var hand = GameDTOAccess.getCardsInZone(gameDTO, gameDTO.state.turnPlayer, Zones.HAND);
                var inPlay = GameDTOAccess.getCardsInZone(gameDTO, gameDTO.state.turnPlayer, Zones.IN_PLAY);
                var allCards = hand.concat(inPlay);

                var moneyToReduce = GameDTOAccess.getPlayerFromUUID(gameDTO, gameDTO.state.turnPlayer).turn.money * -1;
                logicBuffer.addSteps(
                    new EventGeneratorStep(EventIds.ADD_MONEY, new AddMoneyEventArgs(_.Value(gameDTO.state.turnPlayer), _.Value(moneyToReduce))),
                    new ForEachStep(_.Value(allCards), "each_card_chosen", [
                        new EventGeneratorStep(EventIds.DISCARD_CARD, new DiscardCardsEventArgs(_.Reference("each_card_chosen")))
                    ]),
                    new DrawCardsStep(gameDTO.state.turnPlayer, _.Value(5))
                );
                GameDTOAccess.pushNewLogicalBuffer(gameDTO, logicBuffer);
            }
        ));
    }

}

ReactionBuffer.RegisterReactiveComponent(new ReactionKey(ReactionSourceType.SYSTEM, "CleanUpReaction"), (gameDTO, uuid) => { return new CleanUpReaction(); })