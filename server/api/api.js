class API {
    constructor(path, method) {
        this.path = path;
        this.method = method;
    }
    add(app) {
        var handleRequest = (request, result) => {
            if (this.validate(request)) {
                this.process(request, result);
            }
            else {
                result.sendStatus(400);
                result.end();
            }
        };
        if (this.method == HTTPMethod.GET) {
            app.get(this.path, handleRequest);
        }
        else if (this.method == HTTPMethod.POST) {
            app.post(this.path, handleRequest);
        }
    }
}
var HTTPMethod;
(function (HTTPMethod) {
    HTTPMethod[HTTPMethod["GET"] = 0] = "GET";
    HTTPMethod[HTTPMethod["POST"] = 1] = "POST";
})(HTTPMethod || (HTTPMethod = {}));
class AddPlayerApi extends API {
    constructor() {
        super("/addPlayer", HTTPMethod.POST);
    }
    validate(request) {
        var requiredFields = ["name"];
        return new RequiredFieldValidator(requiredFields).check(request);
    }
    process(request, result) {
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
                result.write(JSON.stringify({ "uuid": newPlayer.uuid, "isGameReady": (gameDTO.players.length >= 2) }));
                result.end();
                new DriveGameService().drive();
            });
        });
    }
}
class GetGameStateApi extends API {
    constructor() {
        super("/getGameState", HTTPMethod.GET);
    }
    validate(request) {
        return true;
    }
    process(request, result) {
        fs.readFile('gamestate.txt', function (err, data) {
            result.writeHead(200, { 'Content-Type': 'application/json' });
            result.write(data);
            return result.end();
        });
    }
}
class GetLogsApi extends API {
    constructor() {
        super("/getLogs", HTTPMethod.POST);
    }
    validate(request) {
        var requiredFields = ["fromTimestamp"];
        return new RequiredFieldValidator(requiredFields).check(request);
    }
    process(request, result) {
        var fromTimestamp = request.body["fromTimestamp"];
        fs.readFile('logs.txt', function (err, data) {
            var resultLogs = [];
            var logs = JSON.parse(data);
            logs.forEach((eachLog) => {
                if (eachLog["timestamp"] >= fromTimestamp) {
                    resultLogs.push(eachLog);
                }
            });
            result.writeHead(200, { 'Content-Type': 'application/json' });
            result.write(JSON.stringify(resultLogs));
            return result.end();
        });
    }
}
class GetPossibleMovesApi extends API {
    constructor() {
        super("/getPossibleMoves", HTTPMethod.POST);
    }
    validate(request) {
        var requiredFields = ["playerUUID"];
        return new RequiredFieldValidator(requiredFields).check(request);
    }
    process(request, result) {
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
class InitGameApi extends API {
    constructor() {
        super("/initGame", HTTPMethod.GET);
    }
    validate(request) {
        return true;
    }
    process(request, result) {
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
class MakeMoveApi extends API {
    constructor() {
        super("/makeMove", HTTPMethod.POST);
    }
    validate(request) {
        var requiredFields = ["move"];
        return new RequiredFieldValidator(requiredFields).check(request);
    }
    process(request, result) {
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
class ResetGameApi extends API {
    constructor() {
        super("/resetGame", HTTPMethod.GET);
    }
    validate(request) {
        return true;
    }
    process(request, result) {
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
class Server {
    createServer() {
        var app = express();
        app.use(bodyParser.json());
        app.use(cors());
        this.addAPIs(app);
        return app;
    }
    addAPIs(app) {
        new GetLogsApi().add(app);
        new InitGameApi().add(app);
        new GetGameStateApi().add(app);
        new MakeMoveApi().add(app);
        new ResetGameApi().add(app);
        new GetPossibleMovesApi().add(app);
        new AddPlayerApi().add(app);
    }
    startServer(app) {
        var server = app.listen(8082, function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log("Example app listening at http://%s:%s", host, port);
        });
    }
    init() {
        var app = this.createServer();
        this.startServer(app);
    }
}
new Server().init();
class RequiredFieldValidator {
    constructor(requiredFields) {
        this.requiredFields = requiredFields;
    }
    check(request) {
        var result = true;
        this.requiredFields.forEach((eachField) => {
            if (request.body[eachField] == null || request.body[eachField] == undefined) {
                result = false;
            }
        });
        return result;
    }
}
