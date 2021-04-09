class CardState {
    uuid: string;
    zoneId: number;
    ownerUUID: string;

    constructor(uuid: string, zoneId: number, ownerUUID: string) {
        this.uuid = uuid;
        this.zoneId = zoneId;
        this.ownerUUID = ownerUUID;
    }

}