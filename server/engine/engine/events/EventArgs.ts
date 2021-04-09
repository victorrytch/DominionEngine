class EventArgs {
    data: {} = {};

    add(key: string, value: LogicalVariable) {
        this.data[key] = value;
        return this;
    }

}