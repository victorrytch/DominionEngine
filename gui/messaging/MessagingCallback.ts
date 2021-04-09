class MessageCallback {
    callback: (any) => void;
    removeOnCompletion: boolean;
    id: number;

    constructor(callback: (any) => void, removeOnCompletion: boolean, id: number) {
        this.callback = callback;
        this.removeOnCompletion = removeOnCompletion;
        this.id = id;
    }
}