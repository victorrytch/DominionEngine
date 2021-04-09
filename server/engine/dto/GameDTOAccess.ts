class GameDTOAccess {

    static setPlayerChoice(gameDTO: GameDTO, chosenOptions: any[]): any {
        var stack = GameDTOAccess.getLogicalStack(gameDTO);
        var topBuffer = stack.buffers[stack.buffers.length - 1];
        var currentStep = GameDTOAccess.traverseLogicalStep(gameDTO, topBuffer, topBuffer.getCurrentStep());

        if (currentStep instanceof PlayerChoiceStep) {
            currentStep.fulfill(chosenOptions, topBuffer, gameDTO);
        }
    }

    static traverseLogicalStep(gameDTO: GameDTO, currentBuffer: LogicalBuffer, currentStep: LogicalStep) {
        if (!currentStep.hasSubsteps()) {
            return currentStep;
        }
        else {
            return GameDTOAccess.traverseLogicalStep(gameDTO, currentBuffer, currentStep.getCurrentSubstep(currentBuffer, gameDTO));
        }
    }

    static changeTurns(gameDTO: GameDTO): any {
        var nextPlayer = null;
        gameDTO.players.forEach((value) => {
            if (value.uuid != gameDTO.state.turnPlayer) {
                nextPlayer = value;
            }
        });
        gameDTO.state.turnPlayer = nextPlayer.uuid;
        nextPlayer.turn.buys = 1;
        nextPlayer.turn.actions = 1;
        var lu = new LoggingUtils(gameDTO);
        Log.send("It is now " + lu.fname(gameDTO.state.turnPlayer) + "'s turn.");

    }

    static removeTopReactionBuffer(gameDTO: GameDTO): any {
        gameDTO.engine.reactionStack.splice(gameDTO.engine.reactionStack.indexOf(gameDTO.engine.reactionStack[gameDTO.engine.reactionStack.length- 1]), 1);
    }

    static removeLogicalBuffer(gameDTO: GameDTO, bufferToRemove: LogicalBuffer): any {
        var dtoIdx = null;
        gameDTO.engine.logicalStack.forEach((buffer, index) => {
            if (buffer.uuid == bufferToRemove.uuid) {
                dtoIdx = index;
            }
        });
        gameDTO.engine.logicalStack.splice(dtoIdx, 1);
    }

    static removeEvent(gameDTO: GameDTO, eventToRemove: GameEvent): any {
        var dtoIdx = null;
        gameDTO.engine.eventStack.forEach((event, index) => {
            if (event.eventUUID == eventToRemove.uuid) {
                dtoIdx = index;
            }
        });
        gameDTO.engine.eventStack.splice(dtoIdx, 1);
    }

    static updateEvent(gameDTO: GameDTO, updatingEvent: GameEvent): void {
        //Log.send("EventStack before: " + JSON.stringify(gameDTO.engine.eventStack));
        var indexToUpdate = -1;
        gameDTO.engine.eventStack.forEach((event, index) => {
            if (event.eventUUID == updatingEvent.uuid) {
                indexToUpdate = index;
            }
        });
        if (indexToUpdate > -1) {
            gameDTO.engine.eventStack[indexToUpdate] = updatingEvent.convertToDTO(); 
        }

        //Log.send("EventStack after: " + JSON.stringify(gameDTO.engine.eventStack));
    }

    static pushNewReactionBuffer(gameDTO: GameDTO, newReactionBuffer: ReactionBuffer): any {
        var dto = newReactionBuffer.convertToDTO();
        gameDTO.engine.reactionStack.push(dto);
    }

    static getReactionStack(gameDTO: GameDTO): ReactionStack {
        var stack = new ReactionStack();
        stack.buffers = [];
        gameDTO.engine.reactionStack.forEach((value) => {
            var eventStatus = GameDTOAccess.getEvent(gameDTO, value.eventUUIDReactingTo).status;
            stack.buffers.push(new ReactionBuffer(value.eventUUIDReactingTo, eventStatus, value.potentialReactions));
        });
        return stack;
    }

    static getEventStack(gameDTO: GameDTO): EventStack {
        var stack = new EventStack();
        stack.events = [];
        gameDTO.engine.eventStack.forEach((value) => {
            stack.events.push(GameEvent.createFromDTO(value));
        });
        return stack;
    }

    static getLogicalStack(gameDTO: GameDTO): LogicalStack {
        var stack = new LogicalStack();
        stack.buffers = [];
        gameDTO.engine.logicalStack.forEach((value) => {
            stack.buffers.push(LogicalBuffer.createFromDTO(value, gameDTO));
        });
        return stack;
    }

    static getEvent(gameDTO: GameDTO, eventUUID: string): any {
        var result: GameEvent = null;
        gameDTO.engine.eventStack.forEach((event) => {
            if (event.eventUUID == eventUUID) {
                result = GameEvent.createWithStatus(event.eventId, event.status, event.args)
            }
        });
        return result;
    }

    static getTopEvent(gameDTO: GameDTO): GameEvent {
        var topDTO = gameDTO.engine.eventStack[gameDTO.engine.eventStack.length];
        return GameEvent.createWithStatus(topDTO.eventId, topDTO.status, topDTO.args);
    }


    static updateLogicalBuffer(gameDTO: GameDTO, logicalBuffer: LogicalBuffer): void {
        var dto = logicalBuffer.convertToDTO(gameDTO);
        var indexToUpdate = 0;
        gameDTO.engine.logicalStack.forEach((value, index) => {
            if (value.uuid == logicalBuffer.uuid) {
                indexToUpdate = index;
            }
        });
        gameDTO.engine.logicalStack[indexToUpdate] = dto;
    }

    static getTopLogicalBuffer(gameDTO: GameDTO): LogicalBuffer {
        return LogicalBuffer.createFromDTO(gameDTO.engine.logicalStack[gameDTO.engine.logicalStack.length - 1], gameDTO);
    }

    static isEventStackCleared(gameDTO: GameDTO): boolean {
        return gameDTO.engine.eventStack.length <= 0;
    }

    static isLogicalStackCleared(gameDTO: GameDTO): boolean {
        return gameDTO.engine.logicalStack.length <= 0;
    }

    static isReactionStackCleared(gameDTO: GameDTO): boolean {
        return gameDTO.engine.reactionStack.length <= 0;
    }

    static rebalanceZone(gameDTO: GameDTO, playerUUID: string, zoneId: Zones): any {
        if (zoneId != Zones.SUPPLY) {
            var zoneCards = GameDTOAccess.getCardDTOsInZone(gameDTO, playerUUID, zoneId);
            zoneCards.forEach((value, index) => {
                value.zoneIndex = index;
            });
        }

    }

    static isGameOver(gameDTO: GameDTO): any {
        return false;
    }

    static getObjectForUUID(gameDTO: GameDTO, uuid: string): any {
        var result = null;

        gameDTO.cards.forEach((eachCard) => {
            if (eachCard.uuid == uuid) {
                result = eachCard;
            }
        });

        if (result == null) {
            gameDTO.players.forEach((eachPlayer) => {
                if (eachPlayer.uuid == uuid) {
                    result = eachPlayer;
                }
            });
        }

        return result;
    }

    static setState(gameDTO: GameDTO, state: GameState): any {
        gameDTO.state.state = state;
        //Log.send("Game state is now " + GameState[state]);
    }

    static setTurn(gameDTO: GameDTO, turnPlayerUUID: string): any {
        var lu = new LoggingUtils(gameDTO);
        gameDTO.state.turnPlayer = turnPlayerUUID;
        GameDTOAccess.setState(gameDTO, GameState.TURN_WAITING);
      //  Log.send("It is now " + lu.fname(turnPlayerUUID) + "'s turn.");
       // TurnNotify.send(turnPlayerUUID);
    }

    static removePlayerUnaffectedByEffect(gameDTO: GameDTO, recipient: string, cardProtectedFrom: number): any {
        var indexToRemove = null;
        gameDTO.state.unaffectedPlayers.forEach((value, index) => {
            if (value["playerUUID"] && value["cardProtectedFrom"]) {
                indexToRemove = index;
            }
        });
        gameDTO.state.unaffectedPlayers.splice(indexToRemove, 1);
    }

    static setPlayerUnaffectedByEffect(gameDTO: GameDTO, recipient: string, cardProtectedFrom: number): any {
        var unaffectedEntry = {};
        unaffectedEntry["playerUUID"] = recipient;
        unaffectedEntry["cardProtectedFrom"] = cardProtectedFrom;
        gameDTO.state.unaffectedPlayers.push(unaffectedEntry);
    }

    static shuffleDeck(gameDTO: GameDTO, recipient: string): void {
        var deck: GameDTO_Card[] = GameDTOAccess.getCardDTOsInZone(gameDTO, recipient, Zones.DECK);
        var indexes = new Array(deck.length);
        for (var i = 0; i < indexes.length; i++) {
            indexes[i] = i;
        }
        Util.shuffle(indexes);
        indexes.forEach((value, index) => {
            deck[index].zoneIndex = value;
        });
        gameDTO.cards.sort(function (a, b) {
            return a.zoneIndex - b.zoneIndex;
        });
    }

    static getCardDTOsInZone(gameDTO: GameDTO, recipient: string, zone: Zones): GameDTO_Card[] {
        var result: GameDTO_Card[] = [];
        gameDTO.cards.forEach((value) => {
            if (value.ownerUUID == recipient && value.zoneId == zone) {
                result.push(value);
            }
        });
        return result;
    }

    static setDeckIndex(gameDTO: GameDTO, cardUUID: string, newIndex: any): any {

        var owner = GameDTOAccess.getOwner(gameDTO, cardUUID);

        var deck: GameDTO_Card[] = GameDTOAccess.getCardDTOsInZone(gameDTO, owner, Zones.DECK);
        deck.forEach((value) => {
            if (value.zoneIndex >= newIndex) {
                value.zoneIndex = value.zoneIndex + 1;
            }
        });

        var dto: GameDTO_Card = GameDTOAccess.getCardDTO(gameDTO, cardUUID);
        dto.zoneIndex = newIndex;
    }

    static getAllCardsOwnedBy(gameDTO: GameDTO, ownerUUID: string): string[] {
        var result: string[] = [];
        gameDTO.cards.forEach((value) => {
            if (value.ownerUUID == ownerUUID) {
                result.push(value.uuid);
            }
        });
        return result;
    }

    static countEmptySupplyPiles(gameDTO: GameDTO): number {
        var cardTypes = [];
        gameDTO.cards.forEach((value) => {
            if (value.zoneId == Zones.SUPPLY) {
                var type = value.definitionId;
                if (cardTypes.indexOf(type) == -1) {
                    cardTypes.push(type);
                }
            }
        });

        return 17 - cardTypes.length;
    }

    static getCardsInZone(gameDTO: GameDTO, ownerUUID: string, zone: Zones): string[] {
        var result: string[] = [];
        gameDTO.cards.forEach((value) => {
            if (value.ownerUUID == ownerUUID && value.zoneId == zone) {
                result.push(value.uuid);
            }
        });
        return result;
    }

    static pushEventsToStack(gameDTO: GameDTO, arg1: GameEvent[]): any {
        throw new Error("Method not implemented.");
    }

    static getVictoriesInHand(gameDTO: GameDTO, uuid: any): string[] {
        var results = [];
        var cardsInHand = GameDTOAccess.getCardsInZone(gameDTO, uuid, Zones.HAND);
        cardsInHand.forEach((value) => {
            var definition = GameDTOAccess.getCardDefinition(gameDTO, value);
            if (Util.contains(definition.getCardTypes(), CardType.VICTORY)) {
                results.push(value);
            }
        });
        return results;
    }

    static isPlayerUnaffectedByCard(gameDTO: GameDTO, playerUUID: any, cardUUID: string): any {
        var result = false;
        gameDTO.state.unaffectedPlayers.forEach((value, index) => {
            if (value["playerUUID"] && value["cardProtectedFrom"]) {
                result = true;
            }
        });
        return result;
    }

    static getNextCardInSupplyPile(gameDTO: GameDTO, cardId: CardIds): string {
        var result = null;
        var maxIndex = 0;
        gameDTO.cards.forEach((value) => {
            if (value.zoneId == Zones.SUPPLY && value.definitionId == cardId) {
                if (maxIndex <= value.zoneIndex) {
                    maxIndex = value.zoneIndex;
                    result = value.uuid;
                }
            }
        });
        return result;
    }

    static getCardsInPile(gameDTO: GameDTO, cardId: CardIds): string[] {
        var result: string[] = [];
        gameDTO.cards.forEach((value) => {
            if (value.definitionId == cardId && value.zoneId == Zones.SUPPLY) {
                result.push(value.uuid);
            }
        });
        return result;
    }


    static getCardsOnDeck(gameDTO: GameDTO, ownerUUID: string, numberToGet: number): any {
        GameDTOAccess.rebalanceZone(gameDTO, ownerUUID, Zones.DECK);
        var deck = GameDTOAccess.getCardDTOsInZone(gameDTO, ownerUUID, Zones.DECK);
        var result = [];
        var indexesToGet = [];

        for (var i = 0; i < numberToGet; i++) {
            indexesToGet.push(deck.length - (i + 1));
        }

        deck.forEach((value) => {
            if (Util.contains(indexesToGet, value.zoneIndex)) {
                result.push(value.uuid);
            }
        });

        return result;
    }
    static getCardDefinition(gameDTO: GameDTO, cardUUID: string): CardDefinition {
        var dto = GameDTOAccess.getCardDTO(gameDTO, cardUUID);
        var state = new CardState(dto.uuid, dto.zoneId, dto.ownerUUID);
        var definition = CardDefinition.create(dto.definitionId, state);
        return definition;
    }
    static getCardDTO(gameDTO: GameDTO, uuid: string): GameDTO_Card {
        var result = null;

        gameDTO.cards.forEach((value) => {
            if (value.uuid == uuid) {
                result = value;
            }
        });

        return result;
    }
    static getOwner(gameDTO: GameDTO, uuid: string): string {
        var dto = GameDTOAccess.getCardDTO(gameDTO, uuid);
        return dto.ownerUUID;
    }

    static getOwnerDTO(gameDTO: GameDTO, uuid: string): GameDTO_Player {
        var dto = GameDTOAccess.getCardDTO(gameDTO, uuid);
        var result = null;
        gameDTO.players.forEach((eachPlayer) => {
            if (eachPlayer.uuid == dto.ownerUUID) {
                result = eachPlayer;
            }
        })
        return result;
    }

    static getPlayers(gameDTO: GameDTO): any {
        return gameDTO.players;
    }
    static getTopCardOfDeck(gameDTO: GameDTO, recipient: string): string {
        return GameDTOAccess.getCardsOnDeck(gameDTO, recipient, 1)[0];
    }
    static setOwner(gameDTO: GameDTO, chosenCard: string, recipient: string): any {
        var dto = GameDTOAccess.getCardDTO(gameDTO, chosenCard);
        dto.ownerUUID = recipient;
    }

    static pushNewLogicalBuffer(gameDTO: GameDTO, buffer: LogicalBuffer): void {
        var logicalBuffer = buffer.convertToDTO(gameDTO);
        gameDTO.engine.logicalStack.push(logicalBuffer);
        GameDTOAccess.setState(gameDTO, GameState.RESOLVING_LOGICAL_STACK);
        ReactionStack.currentOutput.createdLogicalOutput = true;
    }


    static setZone(gameDTO: GameDTO, cardUUID: string, zoneId: number) {
        var cardDTO = GameDTOAccess.getCardFromUUID(gameDTO, cardUUID);
        var oldZone = cardDTO.zoneId;
        cardDTO.zoneId = zoneId;
        GameDTOAccess.rebalanceZone(gameDTO, cardUUID, zoneId);
        GameDTOAccess.rebalanceZone(gameDTO, cardUUID, oldZone);
    }

    static pushEventToStack(gameDTO: GameDTO, event: GameEvent) {
        var dto = event.convertToDTO();
        dto.eventUUID = UUID();
        gameDTO.engine.eventStack.push(dto);
    }

    static getCardFromUUID(game: GameDTO, cardUuid: string): GameDTO_Card {
        return game.cards.filter((value) => {
            return value.uuid == cardUuid;
        })[0];
    }

    static getPlayerFromUUID(game: GameDTO, playerUUID: string): GameDTO_Player {
        return game.players.filter((value) => {
            return value.uuid == playerUUID;
        })[0];
    }

    static getPlayerUUIDs_asStringArray(game: GameDTO): string[] {
        return game.players.map((value) => {
            return value.uuid + "";
        });
    }

    static getAvailableCardTypesInSupply(gameDTO: GameDTO): number[] {
        var result = [];

        gameDTO.cards.forEach((value) => {
            if (value.zoneId == Zones.SUPPLY) {
                if (result.indexOf(value.definitionId) == -1) {
                    result.push(value.definitionId);
                }
            }
        });

        return result;
    }
}
