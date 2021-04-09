class WaitingPage {

    render(htmlElement, document) {
        htmlElement.innerHTML = "";
        htmlElement.innerHTML = `
            Waiting for second player to join...
        `;

        new WaitingPageListener(htmlElement, document).listen(3000);
    }

}