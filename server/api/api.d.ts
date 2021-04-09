declare abstract class API {
    path: string;
    method: HTTPMethod;
    constructor(path: string, method: HTTPMethod);
    abstract process(request: any, result: any): any;
    abstract validate(request: any): boolean;
    add(app: any): void;
}
declare enum HTTPMethod {
    GET = 0,
    POST = 1
}
declare class AddPlayerApi extends API {
    constructor();
    validate(request: any): boolean;
    process(request: any, result: any): void;
}
declare class GetGameStateApi extends API {
    constructor();
    validate(request: any): boolean;
    process(request: any, result: any): void;
}
declare class GetLogsApi extends API {
    constructor();
    validate(request: any): boolean;
    process(request: any, result: any): void;
}
declare class GetPossibleMovesApi extends API {
    constructor();
    validate(request: any): boolean;
    process(request: any, result: any): void;
}
declare class InitGameApi extends API {
    constructor();
    validate(request: any): boolean;
    process(request: any, result: any): void;
}
declare class MakeMoveApi extends API {
    constructor();
    validate(request: any): boolean;
    process(request: any, result: any): void;
}
declare class ResetGameApi extends API {
    constructor();
    validate(request: any): boolean;
    process(request: any, result: any): any;
}
declare class Server {
    createServer(): any;
    addAPIs(app: any): void;
    startServer(app: any): void;
    init(): void;
}
declare class RequiredFieldValidator {
    requiredFields: string[];
    constructor(requiredFields: string[]);
    check(request: any): boolean;
}
