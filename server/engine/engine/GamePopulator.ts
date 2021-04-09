declare var alert: any

class GamePopulator {

    static kingdomCards = [
        CardIds.WORKSHOP,
        CardIds.WITCH,
        CardIds.MOAT,
        CardIds.CELLAR,
        CardIds.LIBRARY,
        CardIds.ARTISAN,
        CardIds.BANDIT,
        CardIds.BUREAUCRAT,
        CardIds.CHAPEL,
        CardIds.COUNCIL_ROOM,
        CardIds.FESTIVAL,
        CardIds.HARBINGER,
        CardIds.LABORATORY,
        CardIds.MARKET,
        CardIds.MERCHANT,
        CardIds.MILITIA,
        CardIds.MINE,
        CardIds.MONEYLENDER,
        CardIds.POACHER,
        CardIds.REMODEL,
        CardIds.SENTRY,
        CardIds.SMITHY,
        CardIds.THRONE_ROOM,
        CardIds.VASSAL,
        CardIds.VILLAGE
    ]

    static otherSupplyCards = [
        [CardIds.COPPER, 60],
        [CardIds.SILVER, 40],
        [CardIds.GOLD, 30],
        [CardIds.ESTATE, 24],
        [CardIds.DUCHY, 12],
        [CardIds.PROVINCE, 12],
        [CardIds.CURSE, 10]
    ]

    static populate(gameDTO: GameDTO) {
        GamePopulator.populateCards(gameDTO);
       // GamePopulator.populateUsers(gameDTO);
        GamePopulator.openingDecks(gameDTO);
        GamePopulator.openingDraws(gameDTO);
    }

    static setFirstTurn(gameDTO: GameDTO) {
        Util.shuffle(gameDTO.players);
        GameDTOAccess.setTurn(gameDTO, gameDTO.players[0].uuid);
    }

    static populateCards(gameDTO: GameDTO) {
        var chosenKingdomCards = Util.shuffle(GamePopulator.kingdomCards).slice(0, 10);
        chosenKingdomCards.forEach((value) => {
            for (var i = 0; i < 10; i++) {
                var dto = GamePopulator.createNewCardDTO(gameDTO, value, "NONE");
                gameDTO.cards.push(dto);
            }
        });
        GamePopulator.otherSupplyCards.forEach((value) => {
            var cardId = value[0];
            var numToCreate = value[1];

            for (var i = 0; i < numToCreate; i++) {
                var dto = GamePopulator.createNewCardDTO(gameDTO, cardId, "NONE");
                gameDTO.cards.push(dto);
            }
        });
    }

    static populateUsers(gameDTO: GameDTO) {
        var player1 = new GameDTO_Player();
        player1.uuid = UUID();
        player1.name = "Adam";
        var player2 = new GameDTO_Player();
        player2.name = "Eve";
        player2.uuid = UUID();

        gameDTO.players.push(player1);
        gameDTO.players.push(player2);
    }

    static openingDecks(gameDTO: GameDTO) {
        var _ = new LogicalUtils();
        gameDTO.players.forEach((eachPlayer) => {
            for (var i = 0; i < 7; i++) {
                var nextCopper = GameDTOAccess.getNextCardInSupplyPile(gameDTO, CardIds.COPPER);
                GameDTOAccess.setOwner(gameDTO, nextCopper, eachPlayer.uuid);
                GameDTOAccess.setZone(gameDTO, nextCopper, Zones.DECK);
                Log.send(eachPlayer.name + " gained a COPPER");
            }
            for (var i = 0; i < 3; i++) {
                var nextEstate = GameDTOAccess.getNextCardInSupplyPile(gameDTO, CardIds.ESTATE);
                GameDTOAccess.setOwner(gameDTO, nextEstate, eachPlayer.uuid);
                GameDTOAccess.setZone(gameDTO, nextEstate, Zones.DECK);
                Log.send(eachPlayer.name + " gained an ESTATE");
            }
            GameDTOAccess.shuffleDeck(gameDTO, eachPlayer.uuid);
        });
    }

    static openingDraws(gameDTO: GameDTO) {
        var _ = new LogicalUtils();
        var lu = new LoggingUtils(gameDTO);
        gameDTO.players.forEach((eachPlayer) => {
            for (var i = 0; i < 5; i++) {
                var cardUUID = GameDTOAccess.getTopCardOfDeck(gameDTO, eachPlayer.uuid);
                GameDTOAccess.setZone(gameDTO, cardUUID, Zones.HAND);
                Log.send(eachPlayer.name + " drew " + lu.fname(cardUUID) + ". Owner garuntee: " + lu.owner(cardUUID));
            }
        });
    }

    static createNewCardDTO(gameDTO: GameDTO, id: CardIds, ownerUUID: string) {
        var dto = new GameDTO_Card();
        dto.definitionId = id;
        dto.ownerUUID = ownerUUID;
        dto.uuid = UUID();
        dto.zoneId = Zones.SUPPLY;
        dto.zoneIndex = GameDTOAccess.getCardsInPile(gameDTO, id).length;
        ReactionBuffer.RegisterReactiveComponent(new ReactionKey(ReactionSourceType.CARD, dto.uuid), (gameDTOArg: GameDTO, uuid: string) => {
            var cardDTO = GameDTOAccess.getCardDTO(gameDTOArg, uuid);
            return CardDefinition.createFromDTO(cardDTO);
        });
        return dto;
    }

}
