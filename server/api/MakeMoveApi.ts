class MakeMoveApi extends API {

    constructor() {
        super("/makeMove", HTTPMethod.POST);
    }


    validate(request: any): boolean {
        var requiredFields = ["move"];
        return new RequiredFieldValidator(requiredFields).check(request);
    }

    
    process(request: any, result: any) {
        fs.readFile('gamestate.txt', function (err, data) {
            var gameDTO = GameDTOTransform.createFromJSON(data);
            var moveToMake = request.body["move"];
            var moveObj = Move.fromJson(moveToMake);
            moveObj.execute(gameDTO);
            fs.writeFile('gamestate.txt', JSON.stringify(gameDTO), function (err) {
                new DriveGameService().drive();
                result.sendStatus(200);
                result.end();
            });
        });
       
    }

}