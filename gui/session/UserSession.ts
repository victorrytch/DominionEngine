class UserSession {
    static currentGameDTO: GameDTO;

    static getUUID(): string {
        return CookieUtils.getCookie("uuid");
    }

    static setUUID(value: string): void {
        CookieUtils.setCookie("uuid", value, 500);
    }

    static getCurrentGameDTO(): GameDTO {
        return UserSession.currentGameDTO;
    }

    static setCurrentGameDTO(currentGameDTO: GameDTO): void {
        UserSession.currentGameDTO = currentGameDTO;
    }

}