class GameDTOTransform {

    static createFromJSON(json: string) {
        var jsonObj = JSON.parse(json);
        var gameDTO: GameDTO = new GameDTO();

        var players: GameDTO_Player[] = [];
        jsonObj["players"].forEach((eachPlayer) => {
            var player = GameDTOTransform.obj2Instance(eachPlayer, GameDTO_Player)
            var turn = GameDTOTransform.obj2Instance(eachPlayer["turn"], GameDTO_Player_Turn)
            player.turn = turn;
            players.push(player);
        });

        var cards: GameDTO_Card[] = [];
        jsonObj["cards"].forEach((eachCard) => {
            cards.push(GameDTOTransform.obj2Instance(eachCard, GameDTO_Card));
        });

        var engine = new GameDTO_Engine();
        var logicalStack: GameDTO_LogicalBuffer[] = [];
        jsonObj["engine"]["logicalStack"].forEach((eachLogicalBuffer) => {

            var buffer = GameDTOTransform.obj2Instance(eachLogicalBuffer, GameDTO_LogicalBuffer);
            var steps: GameDTO_LogicalBuffer_Step[] = [];
            eachLogicalBuffer["steps"].forEach((eachStep) => {
                steps.push(GameDTOTransform.obj2Instance(eachStep, GameDTO_LogicalBuffer_Step));
            });
            buffer.steps = steps;

            logicalStack.push(buffer);
        });

        var reactionStack: GameDTO_ReactionBuffer[] = [];
        jsonObj["engine"]["reactionStack"].forEach((eachReactionBuffer) => {

            var buffer = GameDTOTransform.obj2Instance(eachReactionBuffer, GameDTO_ReactionBuffer);
            var potentialReactions: ReactionKey[] = [];
            eachReactionBuffer["potentialReactions"].forEach((eachPotentialReaction) => {
                potentialReactions.push(GameDTOTransform.obj2Instance(eachPotentialReaction, ReactionKey));
            });
            buffer.potentialReactions = potentialReactions;

            reactionStack.push(buffer);
        });

        var eventStack: GameDTO_EventEntry[] = [];
        jsonObj["engine"]["eventStack"].forEach((eachEventEntry) => {

            eventStack.push(GameDTOTransform.obj2Instance(eachEventEntry, GameDTO_EventEntry));
        });

        engine.eventStack = eventStack;
        engine.reactionStack = reactionStack;
        engine.logicalStack = logicalStack;

        var state = GameDTOTransform.obj2Instance(jsonObj["state"], GameDTO_State);

        gameDTO.players = players;
        gameDTO.cards = cards;
        gameDTO.engine = engine;
        gameDTO.state = state;

        return gameDTO;
    }

    static obj2Instance(object, type) {
        var instance = new type();
        for (var key in object) {
            instance[key] = object[key];
        }
        return instance;
    }

}