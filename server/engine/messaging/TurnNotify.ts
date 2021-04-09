class TurnNotify {
    static TURN_EVENT: string = "TURN_EVENT"

    static send(turnPlayer: string) {
        MessagingCenter.notify(TurnNotify.TURN_EVENT, {
            "turnPlayer": turnPlayer
        });
    }

    static subscribe(callback: (turnPlayer) => void) {
        MessagingCenter.addListener(TurnNotify.TURN_EVENT, (message) => {
            callback(message["turnPlayer"]);
        }, false);
    }
}