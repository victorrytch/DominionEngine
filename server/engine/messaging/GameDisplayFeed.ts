class GameDisplayFeed {
    static GAME_FEED_EVENT: string = "GAME_FEED_EVENT"

    static send(gameDTO: GameDTO, action: string) {
        MessagingCenter.notify(GameDisplayFeed.GAME_FEED_EVENT, {
            "gameDTO": gameDTO,
            "action": action
        });
    }

    static subscribe(callback: (gameDTO: GameDTO, action: string) => void) {
        MessagingCenter.addListener(GameDisplayFeed.GAME_FEED_EVENT, (message) => {
            callback(message["gameDTO"], message["action"]);
        }, false);
    }
}