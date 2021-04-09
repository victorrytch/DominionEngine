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
class LogService {
    constructor() {
        Log.subscribe((message) => {
            console.log("Log: " + message["message"]);
            var logText = fs.readFileSync('logs.txt', { encoding: 'utf8', flag: 'r' });
            var logs = JSON.parse(logText);
            logs.push({
                "message": message["message"], "timestamp": new Date().getTime()
            });
            fs.writeFileSync('logs.txt', JSON.stringify(logs));
        });
    }
}
new LogService();
