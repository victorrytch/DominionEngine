class LogBoxClient {
    lastUpdateTimestamp: number = 0;
    isProcessing: boolean = false;

    listen(interval: number) {
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