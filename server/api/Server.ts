
class Server {

    createServer() {
        var app = express();
        app.use(bodyParser.json());
        app.use(cors());
        this.addAPIs(app);
        return app;
    }

    addAPIs(app: any) {
        new GetLogsApi().add(app);
        new InitGameApi().add(app);
        new GetGameStateApi().add(app);
        new MakeMoveApi().add(app);
        new ResetGameApi().add(app);
        new GetPossibleMovesApi().add(app);
        new AddPlayerApi().add(app);
    }

    startServer(app: any) {
        var server = app.listen(8082, function () {
            var host = server.address().address
            var port = server.address().port
            console.log("Example app listening at http://%s:%s", host, port)
        })
    }

    init() {
        var app = this.createServer();
        this.startServer(app);
    }

}
new Server().init();