class GameStateClient {

    static send(callback: (result: any) => void) {
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