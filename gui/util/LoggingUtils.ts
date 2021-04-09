class LoggingUtils {
    gameDTO: GameDTO;

    constructor(gameDTO: GameDTO) {
        this.gameDTO = gameDTO;
    }

    fname(objectUUID: any): string {
        var dto = GameDTOAccess.getObjectForUUID(this.gameDTO, objectUUID);

        if (dto instanceof GameDTO_Card) {
            return CardIds[dto.definitionId];
        }
        else if (dto instanceof GameDTO_Player) {
            return dto.name;
        }
    }

    owner(cardUUID: any): string {
        var ownerDto = GameDTOAccess.getOwnerDTO(this.gameDTO, cardUUID);
        return ownerDto.name;

    }

}