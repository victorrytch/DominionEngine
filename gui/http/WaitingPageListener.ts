class WaitingPageListener {
    isProcessing: boolean = false;
    callback;
    htmlElement;
    document;
    intervalToken;

    constructor(htmlElement, document) {
        this.document = document;
        this.htmlElement = htmlElement;
    }

    listen(interval: number) {
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