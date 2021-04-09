class MessagingCenter {
    private static pubSubMap = {};

    public static addListener(event: string, callback: (any) => void, removeOnCompletion: boolean) {
        if (MessagingCenter.pubSubMap[event] == null) {
            MessagingCenter.pubSubMap[event] = [];
        }

        MessagingCenter.pubSubMap[event].push(new MessageCallback(callback, removeOnCompletion, MessagingCenter.pubSubMap[event].length));
    }

    public static notify(event: string, payload: any) {
        if (MessagingCenter.pubSubMap[event] != null) {
            MessagingCenter.pubSubMap[event].forEach((e, eIdx) => {
                e.callback(payload);
                if (e.removeOnCompletion) {
                    MessagingCenter.pubSubMap[event].splice(eIdx, 1);
                }
            });
        }

    }
}