class GameStateMessenger {
    static GAME_STATE: string = "GAME_STATE"

    static send(gameDTO: GameDTO) {
        MessagingCenter.notify(GameStateMessenger.GAME_STATE, gameDTO);
    }

    static subscribe(callback: (gameDTO: GameDTO) => void) {
        MessagingCenter.addListener(GameStateMessenger.GAME_STATE, callback, false);
    }
}



