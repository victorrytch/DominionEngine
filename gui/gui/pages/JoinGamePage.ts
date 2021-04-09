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