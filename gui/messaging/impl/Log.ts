class Log {
    static LOG_EVENT: string = "LOG_EVENT"

    static send(messageString: string) {
        MessagingCenter.notify(Log.LOG_EVENT, {
            "message": messageString
        });
    }

    static subscribe(callback: (any) => void) {
        MessagingCenter.addListener(Log.LOG_EVENT, callback, false);
    }
}