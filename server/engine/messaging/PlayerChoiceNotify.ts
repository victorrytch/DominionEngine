class PlayerChoiceNotify {

    static PLAYER_CHOICE: string = "PLAYER_CHOICE"

    static send(playerUUID: string, options: string[], prepositionType: PlayerChoicePrepositionValues, prepositionValue: number) {
        MessagingCenter.notify(PlayerChoiceNotify.PLAYER_CHOICE, {
            "playerUUID": playerUUID,
            "options": options,
            "prepositionType": prepositionType,
            "prepositionValue": prepositionValue
        });
    }

    static subscribe(callback: (playerUUID: string, options: string[], prepositionType: PlayerChoicePrepositionValues, prepositionValue: number) => void) {
        MessagingCenter.addListener(PlayerChoiceNotify.PLAYER_CHOICE, (message) => {
            callback(message["playerUUID"], message["options"], message["prepositionType"], message["prepositionValue"]);
        }, false);
    }

}