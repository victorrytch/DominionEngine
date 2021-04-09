var CardIds;
(function (CardIds) {
    CardIds[CardIds["COPPER"] = 0] = "COPPER";
    CardIds[CardIds["WORKSHOP"] = 1] = "WORKSHOP";
    CardIds[CardIds["WITCH"] = 2] = "WITCH";
    CardIds[CardIds["MOAT"] = 3] = "MOAT";
    CardIds[CardIds["CELLAR"] = 4] = "CELLAR";
    CardIds[CardIds["LIBRARY"] = 5] = "LIBRARY";
    CardIds[CardIds["GOLD"] = 6] = "GOLD";
    CardIds[CardIds["SILVER"] = 7] = "SILVER";
    CardIds[CardIds["CURSE"] = 8] = "CURSE";
    CardIds[CardIds["ARTISAN"] = 9] = "ARTISAN";
    CardIds[CardIds["BANDIT"] = 10] = "BANDIT";
    CardIds[CardIds["BUREAUCRAT"] = 11] = "BUREAUCRAT";
    CardIds[CardIds["CHAPEL"] = 12] = "CHAPEL";
    CardIds[CardIds["COUNCIL_ROOM"] = 13] = "COUNCIL_ROOM";
    CardIds[CardIds["DUCHY"] = 14] = "DUCHY";
    CardIds[CardIds["ESTATE"] = 15] = "ESTATE";
    CardIds[CardIds["FESTIVAL"] = 16] = "FESTIVAL";
    CardIds[CardIds["GARDENS"] = 17] = "GARDENS";
    CardIds[CardIds["HARBINGER"] = 18] = "HARBINGER";
    CardIds[CardIds["LABORATORY"] = 19] = "LABORATORY";
    CardIds[CardIds["MARKET"] = 20] = "MARKET";
    CardIds[CardIds["MERCHANT"] = 21] = "MERCHANT";
    CardIds[CardIds["MILITIA"] = 22] = "MILITIA";
    CardIds[CardIds["MINE"] = 23] = "MINE";
    CardIds[CardIds["MONEYLENDER"] = 24] = "MONEYLENDER";
    CardIds[CardIds["POACHER"] = 25] = "POACHER";
    CardIds[CardIds["PROVINCE"] = 26] = "PROVINCE";
    CardIds[CardIds["REMODEL"] = 27] = "REMODEL";
    CardIds[CardIds["SENTRY"] = 28] = "SENTRY";
    CardIds[CardIds["SMITHY"] = 29] = "SMITHY";
    CardIds[CardIds["THRONE_ROOM"] = 30] = "THRONE_ROOM";
    CardIds[CardIds["VASSAL"] = 31] = "VASSAL";
    CardIds[CardIds["VILLAGE"] = 32] = "VILLAGE";
})(CardIds || (CardIds = {}));
class CardState {
    constructor(uuid, zoneId, ownerUUID) {
        this.uuid = uuid;
        this.zoneId = zoneId;
        this.ownerUUID = ownerUUID;
    }
}
var CardType;
(function (CardType) {
    CardType[CardType["TREASURE"] = 0] = "TREASURE";
    CardType[CardType["ACTION"] = 1] = "ACTION";
    CardType[CardType["VICTORY"] = 2] = "VICTORY";
    CardType[CardType["ATTACK"] = 3] = "ATTACK";
    CardType[CardType["REACTION"] = 4] = "REACTION";
    CardType[CardType["CURSE"] = 5] = "CURSE";
})(CardType || (CardType = {}));
class DTO {
}
///<reference path="./DTO.ts" />
class GameDTO extends DTO {
    constructor() {
        super(...arguments);
        this.players = [];
        this.cards = [];
        this.engine = new GameDTO_Engine();
        this.state = new GameDTO_State();
    }
}
class GameDTO_Engine extends DTO {
    constructor() {
        super(...arguments);
        this.logicalStack = [];
        this.reactionStack = [];
        this.eventStack = [];
    }
}
class GameDTO_Player extends DTO {
    constructor() {
        super(...arguments);
        this.turn = new GameDTO_Player_Turn();
    }
}
class GameDTO_Player_Turn extends DTO {
    constructor() {
        super(...arguments);
        this.money = 0;
        this.actions = 0;
        this.buys = 0;
    }
}
class GameDTO_Card extends DTO {
}
class GameDTO_LogicalBuffer extends DTO {
    constructor() {
        super(...arguments);
        this.storedData = {};
    }
}
class GameDTO_LogicalBuffer_Step extends DTO {
}
class GameDTO_LogicalBufferVariable extends DTO {
}
class GameDTO_EventEntry extends DTO {
}
class GameDTO_State extends DTO {
    constructor() {
        super(...arguments);
        this.state = GameState.START;
        this.phase = Phase.ACTION;
        this.unaffectedPlayers = [];
    }
}
class GameDTO_ReactionBuffer extends DTO {
    constructor() {
        super(...arguments);
        this.potentialReactions = [];
    }
}
class GameDTOAccess {
    static getObjectForUUID(gameDTO, uuid) {
        var result = null;
        gameDTO.cards.forEach((eachCard) => {
            if (eachCard.uuid == uuid) {
                result = eachCard;
            }
        });
        if (result == null) {
            gameDTO.players.forEach((eachPlayer) => {
                if (eachPlayer.uuid == uuid) {
                    result = eachPlayer;
                }
            });
        }
        return result;
    }
    static getAvailableCardTypesInSupply(gameDTO) {
        var result = [];
        gameDTO.cards.forEach((value) => {
            if (value.zoneId == Zones.SUPPLY) {
                if (result.indexOf(value.definitionId) == -1) {
                    result.push(value.definitionId);
                }
            }
        });
        return result;
    }
    static getCardDTOsInZone(gameDTO, recipient, zone) {
        var result = [];
        gameDTO.cards.forEach((value) => {
            if (value.ownerUUID == recipient && value.zoneId == zone) {
                result.push(value);
            }
        });
        return result;
    }
    static getCardsInPile(gameDTO, cardId) {
        var result = [];
        gameDTO.cards.forEach((value) => {
            if (value.definitionId == cardId && value.zoneId == Zones.SUPPLY) {
                result.push(value.uuid);
            }
        });
        return result;
    }
    static getOwnerDTO(gameDTO, uuid) {
        var dto = GameDTOAccess.getCardDTO(gameDTO, uuid);
        var result = null;
        gameDTO.players.forEach((eachPlayer) => {
            if (eachPlayer.uuid == dto.ownerUUID) {
                result = eachPlayer;
            }
        });
        return result;
    }
    static getCardDTO(gameDTO, uuid) {
        var result = null;
        gameDTO.cards.forEach((value) => {
            if (value.uuid == uuid) {
                result = value;
            }
        });
        return result;
    }
}
class GameDTOTransform {
    static createFromJSON(json) {
        var jsonObj = JSON.parse(json);
        var gameDTO = new GameDTO();
        var players = [];
        jsonObj["players"].forEach((eachPlayer) => {
            var player = GameDTOTransform.obj2Instance(eachPlayer, GameDTO_Player);
            var turn = GameDTOTransform.obj2Instance(eachPlayer["turn"], GameDTO_Player_Turn);
            player.turn = turn;
            players.push(player);
        });
        var cards = [];
        jsonObj["cards"].forEach((eachCard) => {
            cards.push(GameDTOTransform.obj2Instance(eachCard, GameDTO_Card));
        });
        var engine = new GameDTO_Engine();
        var logicalStack = [];
        jsonObj["engine"]["logicalStack"].forEach((eachLogicalBuffer) => {
            var buffer = GameDTOTransform.obj2Instance(eachLogicalBuffer, GameDTO_LogicalBuffer);
            var steps = [];
            eachLogicalBuffer["steps"].forEach((eachStep) => {
                steps.push(GameDTOTransform.obj2Instance(eachStep, GameDTO_LogicalBuffer_Step));
            });
            buffer.steps = steps;
            logicalStack.push(buffer);
        });
        var reactionStack = [];
        jsonObj["engine"]["reactionStack"].forEach((eachReactionBuffer) => {
            var buffer = GameDTOTransform.obj2Instance(eachReactionBuffer, GameDTO_ReactionBuffer);
            var potentialReactions = [];
            eachReactionBuffer["potentialReactions"].forEach((eachPotentialReaction) => {
                potentialReactions.push(GameDTOTransform.obj2Instance(eachPotentialReaction, ReactionKey));
            });
            buffer.potentialReactions = potentialReactions;
            reactionStack.push(buffer);
        });
        var eventStack = [];
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
var GameState;
(function (GameState) {
    GameState[GameState["START"] = 0] = "START";
    GameState[GameState["TURN_WAITING"] = 1] = "TURN_WAITING";
    GameState[GameState["RESOLVING_LOGICAL_STACK"] = 2] = "RESOLVING_LOGICAL_STACK";
    GameState[GameState["RESOLVING_REACTION_STACK"] = 3] = "RESOLVING_REACTION_STACK";
    GameState[GameState["RESOLVING_EVENT_STACK"] = 4] = "RESOLVING_EVENT_STACK";
    GameState[GameState["WAITING_FOR_PLAYER_CHOICE"] = 5] = "WAITING_FOR_PLAYER_CHOICE";
    GameState[GameState["END"] = 6] = "END";
})(GameState || (GameState = {}));
var Phase;
(function (Phase) {
    Phase[Phase["ACTION"] = 0] = "ACTION";
    Phase[Phase["BUY"] = 1] = "BUY";
    Phase[Phase["CLEAN_UP"] = 2] = "CLEAN_UP";
})(Phase || (Phase = {}));
class ReactionKey {
    constructor(type, id) {
        this.type = type;
        this.id = id;
    }
    static fromString(str) {
        var obj = JSON.parse(str);
        var newKey = new ReactionKey(obj["type"], obj["id"]);
        return newKey;
    }
}
var ReactionSourceType;
(function (ReactionSourceType) {
    ReactionSourceType[ReactionSourceType["CARD"] = 0] = "CARD";
    ReactionSourceType[ReactionSourceType["SYSTEM"] = 1] = "SYSTEM";
})(ReactionSourceType || (ReactionSourceType = {}));
var Zones;
(function (Zones) {
    Zones[Zones["SUPPLY"] = 0] = "SUPPLY";
    Zones[Zones["DECK"] = 1] = "DECK";
    Zones[Zones["HAND"] = 2] = "HAND";
    Zones[Zones["IN_PLAY"] = 3] = "IN_PLAY";
    Zones[Zones["DISCARD_PILE"] = 4] = "DISCARD_PILE";
    Zones[Zones["TRASH"] = 5] = "TRASH";
    Zones[Zones["REVEALED"] = 6] = "REVEALED";
})(Zones || (Zones = {}));
class GameStateDisplay {
    render(htmlElement, document) {
        var newContainer = document.createElement("div");
        newContainer.id = "game_display";
        newContainer.innerHTML = `
            <div id="game_display_header" class="ui top attached tabular menu">
              <a class="item" data-tab="first">Global State</a>
            </div>
            <div class="ui bottom attached tab segment" data-tab="first">
                <div>Phase: <span id = "global_phase">Test</span></div>
                <div>Turn Player: <span id = "global_turn_player">Test</span></div>
                <div>Supply: <span id = "global_supply_info">Test</span></div>
            </div> `;
        htmlElement.appendChild(newContainer);
        setTimeout(() => {
            GameStateClient.send((result) => {
                var gameDTO = GameDTOTransform.createFromJSON(JSON.stringify(result));
                UserSession.setCurrentGameDTO(gameDTO);
                var gameDisplay = document.getElementById("game_display");
                var gameDisplayHeader = document.getElementById("game_display_header");
                var lu = new LoggingUtils(gameDTO);
                gameDTO.players.forEach((value, index) => {
                    var newPlayer = lu.fname(value.uuid);
                    var newPlayerDiv = document.createElement("div");
                    newPlayerDiv.id = "accordian_item_title_" + newPlayer;
                    newPlayerDiv.className = 'item';
                    gameDisplayHeader.appendChild(newPlayerDiv);
                    newPlayerDiv.outerHTML = `
                        <a class="item" data-tab="` + newPlayer + `">` + newPlayer + `</a>
                    `;
                    var newPlayerContentDiv = document.createElement("div");
                    newPlayerContentDiv.id = "accordian_item_content_" + newPlayer;
                    newPlayerContentDiv.className = 'ui bottom attached tab segment';
                    gameDisplay.appendChild(newPlayerContentDiv);
                    newPlayerContentDiv.outerHTML = `
                    <div class="ui bottom attached tab segment" data-tab="` + newPlayer + `">
                      <div>UUID: ` + value.uuid + `</div>
                      <div>Hand: <span id = "player_` + value.uuid + ` + _hand">Test</span></div>
                      <div>Deck: <span id = "player_` + value.uuid + ` + _deck">Test</span></div>
                      <div>Discard Pile: <span id = "player_` + value.uuid + ` + _discard">Test</span></div>
                      <div>In Play: <span id = "player_` + value.uuid + ` + _play">Test</span></div>
                      <div>Money: <span id = "player_` + value.uuid + ` + _money">Test</span></div>
                      <div>Buys: <span id = "player_` + value.uuid + ` + _buy">Test</span></div>
                    </div>
                    `;
                    $('.menu .item').tab();
                });
            });
            new GameStateDisplayListener().listen(3000);
        }, 50);
    }
}
class LogBox {
    render(htmlElement, document) {
        htmlElement.style.height = "50%";
        htmlElement.style.overflow = "scroll";
        Log.subscribe((message) => {
            var newLine = document.createElement('div');
            newLine.innerHTML = message["message"];
            htmlElement.appendChild(newLine);
            htmlElement.scrollTop = htmlElement.scrollHeight;
        });
        setTimeout(() => {
            new LogBoxClient().listen(3000);
        }, 50);
    }
}
class PossibleMoveDisplay {
    render(htmlElement, document) {
    }
}
class GamePage {
    render(htmlElement, document) {
        htmlElement.innerHTML = "";
        htmlElement.innerHTML = `
            <div id="gamedisplay"></div>
            <div id="logbox"></div>
            <div id="possible_moves"></div>
        `;
        setTimeout(() => {
            var gsDisplay = document.getElementById("gamedisplay");
            new GameStateDisplay().render(gsDisplay, document);
            var logElement = document.getElementById("logbox");
            new LogBox().render(logElement, document);
        }, 200);
    }
}
class JoinGamePage {
    render(htmlElement, document) {
        htmlElement.innerHTML = "";
        htmlElement.innerHTML = `
            <div class="ui input" >
              <input id="username_field" type="text" placeholder="Username">
            </div>
            <button class="ui yellow button" id="join_button">Join</button>
        `;
        var joinButton = document.getElementById("join_button");
        joinButton.onclick = () => {
            var usernameField = document.getElementById("username_field");
            var name = usernameField.value;
            AddPlayerClient.send(name, (result) => {
                UserSession.setUUID(result["uuid"]);
                if (result["isGameReady"]) {
                    new GamePage().render(htmlElement, document);
                }
                else {
                    new WaitingPage().render(htmlElement, document);
                }
            });
        };
    }
}
class PageController {
    route(htmlElement, document) {
        GameStateClient.send((result) => {
            if (result["players"].length >= 2) {
                new GamePage().render(htmlElement, document);
            }
            else {
                var isUserInGame = false;
                var gameDTO = GameDTOTransform.createFromJSON(JSON.stringify(result));
                UserSession.setCurrentGameDTO(gameDTO);
                gameDTO.players.forEach((eachPlayer) => {
                    if (eachPlayer.uuid == UserSession.getUUID()) {
                        isUserInGame = true;
                    }
                });
                if (isUserInGame) {
                    new WaitingPage().render(htmlElement, document);
                }
                else {
                    new JoinGamePage().render(htmlElement, document);
                }
            }
        });
    }
}
class WaitingPage {
    render(htmlElement, document) {
        htmlElement.innerHTML = "";
        htmlElement.innerHTML = `
            Waiting for second player to join...
        `;
        new WaitingPageListener(htmlElement, document).listen(3000);
    }
}
class AddPlayerClient {
    static send(name, callback) {
        $.ajax({
            url: HttpConfig.ADD_PLAYER,
            type: "POST",
            data: JSON.stringify({ "name": name }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                callback(result);
            }
        });
    }
}
class GameStateClient {
    static send(callback) {
        $.ajax({
            url: HttpConfig.GET_GAME_STATE,
            type: "GET",
            data: JSON.stringify({}),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                callback(result);
            }
        });
    }
}
class GameStateDisplayListener {
    constructor() {
        this.isProcessing = false;
        this.readyToPingForMoves = true;
    }
    listen(interval) {
        var __this = this;
        setInterval(function () {
            __this.ping();
        }, interval);
    }
    ping() {
        var __this = this;
        console.log("GameStateDisplayListener ping");
        if (!__this.isProcessing) {
            console.log("GameStateDisplayListener process");
            __this.isProcessing = true;
            GameStateClient.send((result) => {
                var gameDTO = GameDTOTransform.createFromJSON(JSON.stringify(result));
                UserSession.setCurrentGameDTO(gameDTO);
                var lu = new LoggingUtils(gameDTO);
                var phaseDisplay = document.getElementById("global_phase");
                var turnDisplay = document.getElementById("global_turn_player");
                var supplyDisplay = document.getElementById("global_supply_info");
                phaseDisplay.innerHTML = Phase[gameDTO.state.phase];
                turnDisplay.innerHTML = lu.fname(gameDTO.state.turnPlayer);
                supplyDisplay.innerHTML = JSON.stringify(GameDTOAccess.getAvailableCardTypesInSupply(gameDTO).map((eachType) => {
                    return [CardIds[eachType], GameDTOAccess.getCardsInPile(gameDTO, eachType).length];
                }));
                gameDTO.players.forEach((value) => {
                    var moneyDisplay = document.getElementById("player_" + value.uuid + " + _money");
                    moneyDisplay.innerHTML = value.turn.money + "";
                    var buyDisplay = document.getElementById("player_" + value.uuid + " + _buy");
                    buyDisplay.innerHTML = value.turn.buys + "";
                    var discardPileDisplay = document.getElementById("player_" + value.uuid + " + _discard");
                    var varToString = GameDTOAccess.getCardDTOsInZone(gameDTO, value.uuid, Zones.DISCARD_PILE).map((eachDTO) => { return lu.fname(eachDTO.uuid); });
                    discardPileDisplay.innerHTML = JSON.stringify(varToString);
                    var inPlayDisplay = document.getElementById("player_" + value.uuid + " + _play");
                    inPlayDisplay.innerHTML = JSON.stringify(GameDTOAccess.getCardDTOsInZone(gameDTO, value.uuid, Zones.IN_PLAY).map((eachDTO) => { return lu.fname(eachDTO.uuid); }));
                    var handDisplay = document.getElementById("player_" + value.uuid + " + _hand");
                    handDisplay.innerHTML = JSON.stringify(GameDTOAccess.getCardDTOsInZone(gameDTO, value.uuid, Zones.HAND).map((eachDTO) => { return lu.fname(eachDTO.uuid); }));
                    var deckDisplay = document.getElementById("player_" + value.uuid + " + _deck");
                    deckDisplay.innerHTML = JSON.stringify(GameDTOAccess.getCardDTOsInZone(gameDTO, value.uuid, Zones.DECK).map((eachDTO) => { return lu.fname(eachDTO.uuid); }));
                });
                if (__this.readyToPingForMoves) {
                    __this.readyToPingForMoves = false;
                    PossibleMovesClient.send(UserSession.getUUID(), (result) => {
                        console.log("polling possible moves");
                        var gameDto = UserSession.getCurrentGameDTO();
                        var lu = new LoggingUtils(gameDto);
                        var isChoiceSelect = false;
                        var possibleMovesArea = document.getElementById("possible_moves");
                        possibleMovesArea.innerHTML = "";
                        if (result.length == 0) {
                            __this.readyToPingForMoves = true;
                        }
                        result.forEach((eachMove, index) => {
                            let thisMove = eachMove;
                            var newButton = document.createElement("div");
                            var color = "red";
                            var moveButtonText = "";
                            if (eachMove["moveType"] == 3) {
                                isChoiceSelect = true;
                                var labelElement = document.createElement("label");
                                labelElement.innerHTML = eachMove["choiceString"];
                                var newSelectElement = document.createElement("select");
                                newSelectElement.id = "choiceSelection";
                                newSelectElement.className = "ui fluid search dropdown";
                                newSelectElement.setAttribute("multiple", "");
                                possibleMovesArea.appendChild(labelElement);
                                possibleMovesArea.appendChild(newSelectElement);
                                eachMove["options"].forEach((eachOption) => {
                                    var newOption = document.createElement("option");
                                    newOption.innerHTML = eachOption;
                                    newOption.value = eachOption;
                                    newSelectElement.appendChild(newOption);
                                });
                                color = "violet";
                                moveButtonText = "Confirm Choices";
                            }
                            else if (eachMove["moveType"] == 0) {
                                color = "orange";
                                moveButtonText = "Play " + lu.fname(eachMove["cardToPlay"]);
                            }
                            else if (eachMove["moveType"] == 1) {
                                color = "teal";
                                moveButtonText = "Buy " + lu.fname(eachMove["cardToBuy"]);
                            }
                            else if (eachMove["moveType"] == 2) {
                                color = "brown";
                                moveButtonText = "Advance Phase";
                            }
                            possibleMovesArea.append(newButton);
                            newButton.outerHTML = "<button id = \"choice_button_" + index + "\", class=\"ui " + color + " button\">" + moveButtonText + "</button>";
                            newButton = document.getElementById("choice_button_" + index);
                            setTimeout(() => {
                                $('.ui.dropdown').dropdown();
                                newButton.onclick = () => {
                                    console.log("clicked");
                                    if (!(isChoiceSelect)) {
                                        possibleMovesArea.innerHTML = "";
                                        MakeMoveClient.send(thisMove, () => {
                                        });
                                        __this.readyToPingForMoves = true;
                                    }
                                    else {
                                        var selections = $("#choiceSelection").dropdown("get value");
                                        if (selections.length < thisMove["minChoicesNum"] || selections.length > thisMove["maxChoicesNum"]) {
                                            alert("This choice only allows between " + thisMove["minChoicesNum"] + " and " + thisMove["maxChoicesNum"] + " selections.");
                                        }
                                        else {
                                            thisMove["choices"] = $("#choiceSelection").dropdown("get value");
                                            possibleMovesArea.innerHTML = "";
                                            MakeMoveClient.send(thisMove, () => {
                                            });
                                            __this.readyToPingForMoves = true;
                                        }
                                    }
                                };
                            }, 100);
                        });
                    });
                }
                __this.isProcessing = false;
            });
        }
    }
}
class HttpConfig {
}
HttpConfig.GET_LOGS = "http://localhost:8082/getLogs";
HttpConfig.GET_GAME_STATE = "http://localhost:8082/getGameState";
HttpConfig.ADD_PLAYER = "http://localhost:8082/addPlayer";
HttpConfig.POSSIBLE_MOVES = "http://localhost:8082/getPossibleMoves";
HttpConfig.MAKE_MOVE = "http://localhost:8082/makeMove";
class LogBoxClient {
    constructor() {
        this.lastUpdateTimestamp = 0;
        this.isProcessing = false;
    }
    listen(interval) {
        var __this = this;
        setInterval(function () {
            __this.ping();
        }, interval);
    }
    ping() {
        console.log("log ping");
        var __this = this;
        if (!__this.isProcessing) {
            __this.isProcessing = true;
            $.ajax({
                url: HttpConfig.GET_LOGS,
                type: "POST",
                data: JSON.stringify({ "fromTimestamp": __this.lastUpdateTimestamp }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    result.forEach((eachLogValue) => {
                        Log.send(eachLogValue["message"]);
                    });
                    __this.lastUpdateTimestamp = new Date().getTime();
                    __this.isProcessing = false;
                }
            });
        }
    }
}
class MakeMoveClient {
    static send(moveString, callback) {
        $.ajax({
            url: HttpConfig.MAKE_MOVE,
            type: "POST",
            data: JSON.stringify({ "move": moveString }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                callback(result);
            }
        });
    }
}
class PossibleMovesClient {
    static send(playerUUID, callback) {
        $.ajax({
            url: HttpConfig.POSSIBLE_MOVES,
            type: "POST",
            data: JSON.stringify({ "playerUUID": playerUUID }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                callback(result);
            }
        });
    }
}
class WaitingPageListener {
    constructor(htmlElement, document) {
        this.isProcessing = false;
        this.document = document;
        this.htmlElement = htmlElement;
    }
    listen(interval) {
        var __this = this;
        this.callback = () => { __this.ping(); };
        this.intervalToken = setInterval(__this.callback, interval);
    }
    stop() {
        clearInterval(this.intervalToken);
    }
    ping() {
        console.log("WaitingPageListener.ping()");
        var __this = this;
        if (!__this.isProcessing) {
            __this.isProcessing = true;
            GameStateClient.send((result) => {
                __this.isProcessing = false;
                if (result["players"].length >= 2) {
                    __this.stop();
                    new GamePage().render(this.htmlElement, this.document);
                }
            });
        }
    }
}
class MessageCallback {
    constructor(callback, removeOnCompletion, id) {
        this.callback = callback;
        this.removeOnCompletion = removeOnCompletion;
        this.id = id;
    }
}
class MessagingCenter {
    static addListener(event, callback, removeOnCompletion) {
        if (MessagingCenter.pubSubMap[event] == null) {
            MessagingCenter.pubSubMap[event] = [];
        }
        MessagingCenter.pubSubMap[event].push(new MessageCallback(callback, removeOnCompletion, MessagingCenter.pubSubMap[event].length));
    }
    static notify(event, payload) {
        if (MessagingCenter.pubSubMap[event] != null) {
            MessagingCenter.pubSubMap[event].forEach((e, eIdx) => {
                e.callback(payload);
                if (e.removeOnCompletion) {
                    MessagingCenter.pubSubMap[event].splice(eIdx, 1);
                }
            });
        }
    }
}
MessagingCenter.pubSubMap = {};
class GameStateMessenger {
    static send(gameDTO) {
        MessagingCenter.notify(GameStateMessenger.GAME_STATE, gameDTO);
    }
    static subscribe(callback) {
        MessagingCenter.addListener(GameStateMessenger.GAME_STATE, callback, false);
    }
}
GameStateMessenger.GAME_STATE = "GAME_STATE";
class Log {
    static send(messageString) {
        MessagingCenter.notify(Log.LOG_EVENT, {
            "message": messageString
        });
    }
    static subscribe(callback) {
        MessagingCenter.addListener(Log.LOG_EVENT, callback, false);
    }
}
Log.LOG_EVENT = "LOG_EVENT";
class PossibleMovesMessenger {
    static send(moves) {
        MessagingCenter.notify(PossibleMovesMessenger.POSSIBLE_MOVES, moves);
    }
    static subscribe(callback) {
        MessagingCenter.addListener(PossibleMovesMessenger.POSSIBLE_MOVES, callback, false);
    }
}
PossibleMovesMessenger.POSSIBLE_MOVES = "POSSIBLE_MOVES";
class UserSession {
    static getUUID() {
        return CookieUtils.getCookie("uuid");
    }
    static setUUID(value) {
        CookieUtils.setCookie("uuid", value, 500);
    }
    static getCurrentGameDTO() {
        return UserSession.currentGameDTO;
    }
    static setCurrentGameDTO(currentGameDTO) {
        UserSession.currentGameDTO = currentGameDTO;
    }
}
class CookieUtils {
    static setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    static getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    static eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }
}
var $ = $ || {};
var alert = alert || {};
var document = document || {};
class LoggingUtils {
    constructor(gameDTO) {
        this.gameDTO = gameDTO;
    }
    fname(objectUUID) {
        var dto = GameDTOAccess.getObjectForUUID(this.gameDTO, objectUUID);
        if (dto instanceof GameDTO_Card) {
            return CardIds[dto.definitionId];
        }
        else if (dto instanceof GameDTO_Player) {
            return dto.name;
        }
    }
    owner(cardUUID) {
        var ownerDto = GameDTOAccess.getOwnerDTO(this.gameDTO, cardUUID);
        return ownerDto.name;
    }
}
