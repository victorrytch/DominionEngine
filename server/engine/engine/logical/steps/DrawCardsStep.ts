class DrawCardsStep extends CompoundStep {

    constructor(ownerUUID: string, amount: LogicalVariable) {
        var steps = [];

        if (ownerUUID != null && amount != null) {
            var _ = new LogicalUtils();

            if (amount.type == LogicalVariableType.VALUE) {
                var amountValue = amount.value;
                for (var i = 0; i < amountValue; i++) {
                    steps.push(new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(ownerUUID), "deckSize"));
                    steps.push(new RelationalStep(_.Reference("deckSize"), RelationalOptions.EQUALS, _.Value(0), [
                        new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(ownerUUID)))
                    ]));
                    steps.push(new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(ownerUUID), "deckSize"));
                    steps.push(new RelationalStep(_.Reference("deckSize"), RelationalOptions.GREATER_THAN, _.Value(0), [
                        new EventGeneratorStep(EventIds.DRAW_CARD, new DrawCardsEventArgs(_.Value(ownerUUID)))
                    ]));
                }
            }
            else if (amount.type == LogicalVariableType.REFERENCE) {
                steps.push(new LoopStep(amount, [
                    new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(ownerUUID), "deckSize"),
                    new RelationalStep(_.Reference("deckSize"), RelationalOptions.EQUALS, _.Value(0), [
                        new EventGeneratorStep(EventIds.RESHUFFLE_DECK, new ReshuffleDeckEventArgs(_.Value(ownerUUID)))
                    ]),
                    new LoadDeckInfoStep(LoadDeckInfoStepOptions.DECK_SIZE, _.Value(ownerUUID), "deckSize"),
                    new RelationalStep(_.Reference("deckSize"), RelationalOptions.GREATER_THAN, _.Value(0), [
                        new EventGeneratorStep(EventIds.DRAW_CARD, new DrawCardsEventArgs(_.Value(ownerUUID)))
                    ])
                ]
                ));
            }
        }
        

        super(steps);
    }

    getStepId(): StepId {
        return StepId.DRAW_CARDS;
    }


}

RegisterEventBufferStep(DrawCardsStep);