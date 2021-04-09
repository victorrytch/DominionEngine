class GetLogsApi extends API {

    constructor() {
        super("/getLogs", HTTPMethod.POST);
    }

    validate(request: any): boolean {
        var requiredFields = ["fromTimestamp"];
        return new RequiredFieldValidator(requiredFields).check(request);
    }

    process(request: any, result: any) {
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