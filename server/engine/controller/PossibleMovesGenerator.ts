class PossibleMovesGenerator {

    generate(playerUUID: string, gameDTO: GameDTO): Move[] {
        var result = [];

        if (playerUUID == gameDTO.state.turnPlayer) {
            if (gameDTO.state.state == GameState.WAITING_FOR_PLAYER_CHOICE) {
                var _ = new LogicalUtils();
                var stack = GameDTOAccess.getLogicalStack(gameDTO);
                var topBuffer = stack.buffers[stack.buffers.length - 1];
                var currentStep = GameDTOAccess.traverseLogicalStep(gameDTO, topBuffer, topBuffer.getCurrentStep());
                if (currentStep instanceof PlayerChoiceStep) {
                    var optionsResolved = _.ResolveVariable(currentStep.options, topBuffer);
                    var maxChoicesNum;
                    var minChoicesNum; 
                    if (currentStep.preposition.type == PlayerChoicePrepositionValues.EXACTLY) {
                        maxChoicesNum = _.ResolveVariable(currentStep.preposition.value, topBuffer);
                        minChoicesNum = _.ResolveVariable(currentStep.preposition.value, topBuffer);
                    }
                    else {
                        minChoicesNum = 0
                        maxChoicesNum = _.ResolveVariable(currentStep.preposition.value, topBuffer);
                    }
                    result.push(currentStep.choiceType, new ChoiceMove([], optionsResolved, minChoicesNum, maxChoicesNum, currentStep.displayText));
                }
            }
            else if (gameDTO.state.state == GameState.TURN_WAITING) {
                var playerDTO = GameDTOAccess.getPlayerFromUUID(gameDTO, playerUUID);

                GameDTOAccess.getCardsInZone(gameDTO, playerUUID, Zones.HAND).forEach((eachCardInHand) => {
                    var definition = GameDTOAccess.getCardDefinition(gameDTO, eachCardInHand);
                    if (definition.canPlay(gameDTO)) {
                        result.push(new PlayMove(eachCardInHand));
                    }
                });

                if (gameDTO.state.phase == Phase.BUY && playerDTO.turn.buys > 0) {
                    GameDTOAccess.getAvailableCardTypesInSupply(gameDTO).forEach((eachType) => {
                        if (eachType != CardIds.COPPER) {
                            var topCard = GameDTOAccess.getNextCardInSupplyPile(gameDTO, eachType);
                            var definition = GameDTOAccess.getCardDefinition(gameDTO, topCard);
                            var cost = definition.getCost();
                            if (playerDTO.turn.money >= cost) {
                                result.push(new BuyMove(playerDTO.uuid, topCard));
                            }
                        }
                    });
                }

                result.push(new AdvancePhaseMove());
            }
           
        }
        

        return result;
    }

}