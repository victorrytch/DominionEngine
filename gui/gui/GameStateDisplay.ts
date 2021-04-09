class GameStateDisplay {

    render(htmlElement: any, document: any) {
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