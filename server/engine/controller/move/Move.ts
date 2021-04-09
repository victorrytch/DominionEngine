///<reference path="MoveType.ts" />

abstract class Move {
    static MOVE_GENERATORS: any = {};

    abstract execute(gameDTO: GameDTO);
    abstract getMoveType();


    static fromJson(json: any): Move {
        var moveType = json["moveType"];
        var newInstance = Move.create(moveType);
        for (var key in json) {
            newInstance[key] = json[key];
        }
        return newInstance;
    }

    static toJsonObject(moveObject: Move, gameDTO: GameDTO): any {
        var instance = {};
        for (var key in moveObject) {
            instance[key] = moveObject[key];
        }
        instance["moveType"] = moveObject.getMoveType();
        return instance;
    }

    static registerMoveGenerator(id: MoveType, generator: () => Move) {
        Move.MOVE_GENERATORS[id] = generator;
    }

    static create(moveType: MoveType): Move {
        return Move.MOVE_GENERATORS[moveType]();
    }

    configureGenerator() {
        var _this = this;
        Move.registerMoveGenerator(this.getMoveType(), () => {
            var instance = new (<any>_this).constructor();
            return instance;
        });
    }
}

function RegisterMove(moveType: any) {
    new moveType().configureGenerator();
}