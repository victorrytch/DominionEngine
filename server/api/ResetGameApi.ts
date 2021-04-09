class ResetGameApi extends API {

    constructor() {
        super("/resetGame", HTTPMethod.GET);
    }

    validate(request: any): boolean {
        return true;
    }

    process(request: any, result: any) {
        var gameDTO = new GameDTO();
        fs.writeFile('gamestate.txt', JSON.stringify(gameDTO), function (err) {
            //new DriveGameService().drive();
        });
        fs.writeFile('logs.txt', "[]", function (err) {

        });
        result.sendStatus(200);
        return result.end();
    }

}