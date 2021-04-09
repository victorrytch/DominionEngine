class GetPossibleMovesApi extends API {

    constructor() {
        super("/getPossibleMoves", HTTPMethod.POST);
    }


    validate(request: any): boolean {
        var requiredFields = ["playerUUID"];
        return new RequiredFieldValidator(requiredFields).check(request);
    }

    process(request: any, result: any) {
        var playerUUID = request.body["playerUUID"];
        fs.readFile('gamestate.txt', function (err, data) {
            var gameDTO = GameDTOTransform.createFromJSON(data);
            var moves = new PossibleMovesGenerator().generate(playerUUID, gameDTO).map((eachMove) => { return Move.toJsonObject(eachMove); });
            result.writeHead(200, { 'Content-Type': 'application/json' });
            result.write(JSON.stringify(moves));
            result.end();
        });
    }

}