class InitGameApi extends API {

    constructor() {
        super("/initGame", HTTPMethod.GET);
    }

    validate(request: any): boolean {
        return true;
    }

    process(request: any, result: any) {
        if (!fs.existsSync('gamestate.txt')) {
            fs.writeFile('gamestate.txt', JSON.stringify(gameDTO), function (err) {
                new DriveGameService().drive();
            });
        }
        if (!fs.existsSync('logs.txt')) {
            var gameDTO = new GameDTO();
            fs.writeFile('logs.txt', "[]", function (err) {

            });
        }
        result.sendStatus(200);
    }

}