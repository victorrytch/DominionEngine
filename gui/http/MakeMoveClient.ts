class MakeMoveClient {

    static send(moveString: string, callback: (result: any) => void) {
        $.ajax({
            url: HttpConfig.MAKE_MOVE,
            type: "POST",
            data: JSON.stringify({ "move": moveString }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                callback(result);
            }
        });
    }

}