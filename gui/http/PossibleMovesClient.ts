class PossibleMovesClient {

    static send(playerUUID: string, callback: (result: any) => void) {
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