class DriveGameService {

    drive() {
        fs.readFile('gamestate.txt', function (err, data) {
            var gameDTO = GameDTOTransform.createFromJSON(data);
            new GameDriver(gameDTO).process();
            fs.writeFile('gamestate.txt', JSON.stringify(gameDTO), function (err) {

            });
        });
    }

}