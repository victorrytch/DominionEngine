abstract class API {
    path: string;
    method: HTTPMethod;

    constructor(path: string, method: HTTPMethod) {
        this.path = path;
        this.method = method;
    }

    abstract process(request: any, result: any);
    abstract validate(request: any): boolean;

    add(app: any) {
        var handleRequest = (request: any, result: any) => {
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

enum HTTPMethod {
    GET,
    POST
}