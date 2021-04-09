class PageController {

    route(htmlElement, document) {
        GameStateClient.send((result) => {
            if (result["players"].length >= 2) {
                new GamePage().render(htmlElement, document);
            }
            else {
                var isUserInGame: boolean = false;
                var gameDTO = GameDTOTransform.createFromJSON(JSON.stringify(result));
                UserSession.setCurrentGameDTO(gameDTO);
                gameDTO.players.forEach((eachPlayer) => {
                    if (eachPlayer.uuid == UserSession.getUUID()) {
                        isUserInGame = true;
                    }
                });
                if (isUserInGame) {
                    new WaitingPage().render(htmlElement, document);
                }
                else {
                    new JoinGamePage().render(htmlElement, document);
                }
            }
        });
    }

}