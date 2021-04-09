///<reference path="../LogicalStep.ts" />

enum LoadDeckInfoStepOptions{
    TOP_CARD,
    DECK_SIZE
}

class LoadDeckStepCardAtIndexFromTopOption {
    indexFromTop: number;

    constructor(indexFromTop: number) {
        this.indexFromTop = indexFromTop;
    }
}


class LoadDeckInfoStep extends LogicalStep {
    option: LoadDeckInfoStepOptions | LoadDeckStepCardAtIndexFromTopOption;
    logicalBufferReferencePlayerUUID: LogicalVariable;
    logicalBufferReturnKey: string;

    constructor(option: LoadDeckInfoStepOptions | LoadDeckStepCardAtIndexFromTopOption, logicalBufferReferencePlayerUUID: LogicalVariable, logicalBufferReturnKey: string) {
        super();
        this.option = option;
        this.logicalBufferReferencePlayerUUID = logicalBufferReferencePlayerUUID;
        this.logicalBufferReturnKey = logicalBufferReturnKey;
    }

    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean {
        //Log.send("****** INSIDE LoadDeckInfoStep");
        var _ = new LogicalUtils();
        var playerUUID = _.ResolveVariable(this.logicalBufferReferencePlayerUUID, logicalBuffer);

        var requestedInfo = null;
        var deckSize = GameDTOAccess.getCardsInZone(gameDTO, playerUUID, Zones.DECK).length;

        if (this.option instanceof LoadDeckStepCardAtIndexFromTopOption) {
            var cardsOnDeck = GameDTOAccess.getCardsOnDeck(gameDTO, playerUUID, 1 + this.option.indexFromTop);
            requestedInfo = cardsOnDeck[cardsOnDeck.length - 1];
        }
        else {
            if (this.option == LoadDeckInfoStepOptions.TOP_CARD) {
                requestedInfo = GameDTOAccess.getCardsOnDeck(gameDTO, playerUUID, 1)[0];
            }
            else if (this.option == LoadDeckInfoStepOptions.DECK_SIZE) {
                //Log.send("Deck size requested: " + deckSize);
                requestedInfo = deckSize;
            }
        }

        logicalBuffer.storedData[this.logicalBufferReturnKey] = requestedInfo;

        return true;
    }


    reset(): void {

    }


    getStepId(): StepId {
        return StepId.LOAD_DECK;
    }
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) {
        this.uuid = dto.uuid;
        if (Util.isNumber(dto.args["option"])) {
            this.option = dto.args["option"];
        }
        else{
            this.option = new LoadDeckStepCardAtIndexFromTopOption(JSON.parse(dto.args["option"])["indexFromTop"]);
        }

        this.logicalBufferReferencePlayerUUID = LogicalVariable.generateFromDTO(dto.args["logicalBufferReferencePlayerUUID"]);
        this.logicalBufferReturnKey = dto.args["logicalBufferReturnKey"];
    }
    convertToDTO(): GameDTO_LogicalBuffer_Step {
        var dto = new GameDTO_LogicalBuffer_Step();
        dto.uuid = this.uuid;
        dto.stepId = this.getStepId();
        dto.args = {};
        if (this.option instanceof LoadDeckStepCardAtIndexFromTopOption) {
            dto.args["option"] = JSON.stringify(this.option);
        }
        else {
            dto.args["option"] = this.option;
        }
        dto.args["logicalBufferReferencePlayerUUID"] = this.logicalBufferReferencePlayerUUID.convertToDTO();
        dto.args["logicalBufferReturnKey"] = this.logicalBufferReturnKey;
        return dto;
    }

    hasSubsteps(): boolean {
        return false;
    }

    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep {
        return this;
    }

}


RegisterEventBufferStep(LoadDeckInfoStep);