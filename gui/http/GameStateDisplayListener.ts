class GameStateDisplayListener {

    isProcessing: boolean = false;
    readyToPingForMoves: boolean = true;

    listen(interval: number) {
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
                supplyDisplay.innerHTML = JSON.stringify(GameDTOAccess.getAvailableCardTypesInSupply(gameDTO).map(
                    (eachType) => {
                        return [CardIds[eachType], GameDTOAccess.getCardsInPile(gameDTO, eachType).length];
                    }
                ));


                gameDTO.players.forEach((value) => {
                    var moneyDisplay = document.getElementById("player_" + value.uuid + " + _money");
                    moneyDisplay.innerHTML = value.turn.money + "";

                    var buyDisplay = document.getElementById("player_" + value.uuid + " + _buy");
                    buyDisplay.innerHTML = value.turn.buys + "";

                    var discardPileDisplay = document.getElementById("player_" + value.uuid + " + _discard");
                    var varToString = GameDTOAccess.getCardDTOsInZone(gameDTO, value.uuid, Zones.DISCARD_PILE).map((eachDTO) => { return lu.fname(eachDTO.uuid); });
                    discardPileDisplay.innerHTML = JSON.stringify(varToString);

                    var inPlayDisplay = document.getElementById("player_" + value.uuid + " + _play");
                    inPlayDisplay.innerHTML = JSON.stringify(GameDTOAccess.getCardDTOsInZone(gameDTO, value.uuid, Zones.IN_PLAY).map((eachDTO) => { return lu.fname(eachDTO.uuid); }))

                    var handDisplay = document.getElementById("player_" + value.uuid + " + _hand");
                    handDisplay.innerHTML = JSON.stringify(GameDTOAccess.getCardDTOsInZone(gameDTO, value.uuid, Zones.HAND).map((eachDTO) => { return lu.fname(eachDTO.uuid); }))

                    var deckDisplay = document.getElementById("player_" + value.uuid + " + _deck");
                    deckDisplay.innerHTML = JSON.stringify(GameDTOAccess.getCardDTOsInZone(gameDTO, value.uuid, Zones.DECK).map((eachDTO) => { return lu.fname(eachDTO.uuid); }))
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

                                    if (eachMove["choiceType"] == 0) {
                                        newOption.innerHTML = lu.fname(eachOption);
                                    }
                                    else {
                                        newOption.innerHTML = eachOption;
                                    }
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

                                }
                            }, 100);
                        });
                    });
               }
                __this.isProcessing = false;
                });
            }
    }

}