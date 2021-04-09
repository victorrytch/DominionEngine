class AddPlayerApi extends API {

    constructor() {
        super("/addPlayer", HTTPMethod.POST);
    }

    validate(request: any): boolean {
        var requiredFields = ["name"];
        return new RequiredFieldValidator(requiredFields).check(request);
    }


    process(request: any, result: any) {
        var name = request.body["name"];
        var newPlayer = new GameDTO_Player();
        newPlayer.uuid = UUID();
        newPlayer.name = name;

        fs.readFile('gamestate.txt', function (err, data) {
            var gameDTO = GameDTOTransform.createFromJSON(data);
            gameDTO.players.push(newPlayer);
            var isFull = (gameDTO.players.length >= 2);
            if (isFull) {
                gameDTO.state.state = GameState.START;
            }
            fs.writeFile('gamestate.txt', JSON.stringify(gameDTO), function (err) {
                result.writeHead(200, { 'Content-Type': 'application/json' });
                result.write(JSON.stringify({ "uuid": newPlayer.uuid, "isGameReady": (gameDTO.players.length >= 2)}));
                result.end();
                new DriveGameService().drive();
            });
        });
    }

}