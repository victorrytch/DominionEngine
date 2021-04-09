abstract class CardDefinition implements Reactive{


    static CARD_DEFINITIONS = {};

    static registerCardGenerator(id: number, generator: (state: CardState) => CardDefinition) {
        CardDefinition.CARD_DEFINITIONS[id] = generator;
    }

    static create(id: number, state: CardState): CardDefinition {
        return CardDefinition.CARD_DEFINITIONS[id](state);
    }

    static createFromDTO(dto: GameDTO_Card): CardDefinition {
        var state = new CardState(dto.uuid, dto.zoneId, dto.ownerUUID);
        return CardDefinition.CARD_DEFINITIONS[dto.definitionId](state);
    }

    cardState: CardState;
    reactions: Reaction[] = [];

    constructor(cardState: CardState | EmptyCardArgs) {
        if (!(cardState instanceof EmptyCardArgs)) {
            this.cardState = cardState;
            this.setReactions();
        }
    }

    canPlay(gameDTO: GameDTO): boolean {
        var result = false;

        if (gameDTO.state.phase == Phase.ACTION) {
            if (this.hasType(CardType.ACTION)) {
                result = true;
            }
        }
        else if (gameDTO.state.phase == Phase.BUY) {
            if (this.hasType(CardType.TREASURE)) {
                result = true;
            }
        }

        return result
    }

    getReactions(): Reaction[] {
        return this.reactions;
    }

    addOnPlay(effectLogic: (event: GameEvent, gameDTO: GameDTO) => void) {
        var _this = this;
        var onPlay = new Reaction(
            EventStatus.RESOLVED,
            (event: GameEvent, gameDTO: GameDTO) => {
                if ((event.getId() == EventIds.CARD_PLAYED) && (event.args[CardPlayedEvent.CARD_UUID] == _this.cardState.uuid)) {
                    return true;
                }
                return false;
            },
            effectLogic
        );
        this.reactions.push(onPlay);
    }

    configureGenerator() {
        var _this = this;
        CardDefinition.registerCardGenerator(this.getCardId(), (state) => {
            var instance = new (<any>_this).constructor(state);
            return instance;
        });
    }

    hasType(cardType: CardType): boolean {
        var result = false;

        this.getCardTypes().forEach((value) => {
            if (value == cardType) {
                result = true;
            }
        });

        return result;
    }

    abstract setReactions(): void;
    abstract getCardId(): number;
    abstract getCardTypes(): CardType[];
    abstract getCost(): number;
    abstract getVictoryPoints(gameDTO: GameDTO): number;

}

class EmptyCardArgs {

}

function RegisterCard(cardType: any) {
    new cardType(new EmptyCardArgs()).configureGenerator();
}
