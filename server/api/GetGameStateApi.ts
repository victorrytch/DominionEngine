class GetGameStateApi extends API {

    constructor() {
        super("/getGameState", HTTPMethod.GET);
    }

    validate(request: any): boolean {
        return true;
    }

    process(request: any, result: any) {
        fs.readFile('gamestate.txt', function (err, data) {
            result.writeHead(200, { 'Content-Type': 'application/json' });
            result.write(data);
            return result.end();
        });
    }

}