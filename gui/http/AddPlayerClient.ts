class AddPlayerClient {

    static send(name: string, callback: (result: any) => void) {
        $.ajax({
            url: HttpConfig.ADD_PLAYER,
            type: "POST",
            data: JSON.stringify({ "name": name }),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                callback(result);
            }
        });
    }

}