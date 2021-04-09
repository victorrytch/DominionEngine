class Reaction {
    validStatusCheck: EventStatus;
    canActivate: (event, gameDTO) => boolean;
    effectLogic: (event, gameDTO) => void;


    constructor(status: EventStatus, canActivate: (event, gameDTO) => boolean, effectLogic: (event, gameDTO) => void) {
        this.validStatusCheck = status;
        this.canActivate = canActivate;
        this.effectLogic = effectLogic;
    }

}