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