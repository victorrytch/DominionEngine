class GameDTOAccess {

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

    static getCardDTOsInZone(gameDTO: GameDTO, recipient: string, zone: Zones): GameDTO_Card[] {
        var result: GameDTO_Card[] = [];
        gameDTO.cards.forEach((value) => {
            if (value.ownerUUID == recipient && value.zoneId == zone) {
                result.push(value);
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

    static getCardDTO(gameDTO: GameDTO, uuid: string): GameDTO_Card {
        var result = null;

        gameDTO.cards.forEach((value) => {
            if (value.uuid == uuid) {
                result = value;
            }
        });

        return result;
    }

}
