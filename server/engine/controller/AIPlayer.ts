
class AIPlayer {
    uuid: string;
    playerUUIDMappedTo: string;
    gameDTO: GameDTO;

    constructor(gameDTO: GameDTO, playerUUIDMappedTo: string) {
        var __this = this;
        this.gameDTO = gameDTO;
        this.uuid = UUID();
        this.playerUUIDMappedTo = playerUUIDMappedTo;

        var lu = new LoggingUtils(gameDTO);
        TurnNotify.subscribe((turnPlayer) => {
            if (turnPlayer == this.playerUUIDMappedTo) {
                if (GlobalAIConfig.AUTORUN) {
                    this.doTurn(gameDTO);
                }
                else {
                    Log.send(this.uuid + ": Press A to advance " + lu.fname(this.playerUUIDMappedTo) + "'s turn.");
                    var thisCallbackTwo = (event) => {
                        if (event.key == "a") {
                            window.removeEventListener('keydown', thisCallbackTwo);
                            this.doTurn(gameDTO);
                        }
                    };

                    window.addEventListener('keydown', thisCallbackTwo);
                }

                
            }
        });
        PlayerChoiceNotify.subscribe((playerUUID: string, options: string[], prepositionType: PlayerChoicePrepositionValues, prepositionValue: number) => {
            if (__this.playerUUIDMappedTo == playerUUID) {
                GameDTOAccess.setPlayerChoice(gameDTO, this.makePlayerChoice(options, prepositionType, prepositionValue));
            }
        });
    }

    doTurn(gameDTO: GameDTO) {
        var __this = this;
        var lu = new LoggingUtils(gameDTO);
        Log.send(lu.fname(this.playerUUIDMappedTo) + " is thinking...");
        setTimeout(function () {

            var moves = new PossibleMovesGenerator().generate(__this.playerUUIDMappedTo, gameDTO);
            if (moves.length > 0) {
                if (GlobalAIConfig.AUTORUN) {
                    Util.shuffle(moves);
                    moves[0].execute(gameDTO);
                    GameDTOAccess.setState(gameDTO, GameState.RESOLVING_EVENT_STACK);
                    DriverNotify.ping();
                }
                else {
                    MessagingCenter.notify("move_display", { moves: moves, gameDto: gameDTO });
                }
            }
            

        }, 500);
    }

    makePlayerChoice(options: string[], prepositionType: PlayerChoicePrepositionValues, prepositionValue: number) {
        var numberToPick = null;

        if (prepositionType == PlayerChoicePrepositionValues.EXACTLY) {
            numberToPick = prepositionValue;
        }
        else {
            numberToPick = Util.randomInRange(0, prepositionValue);
        }

        var choices = [];
        var shuffledOptions = Util.shuffle(options);

        for (var i = 0; i < numberToPick; i++) {
            choices.push(shuffledOptions[i]);
        }

        return choices;
    }

}