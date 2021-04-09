declare abstract class CardDefinition implements Reactive {
    static CARD_DEFINITIONS: {};
    static registerCardGenerator(id: number, generator: (state: CardState) => CardDefinition): void;
    static create(id: number, state: CardState): CardDefinition;
    static createFromDTO(dto: GameDTO_Card): CardDefinition;
    cardState: CardState;
    reactions: Reaction[];
    constructor(cardState: CardState | EmptyCardArgs);
    canPlay(gameDTO: GameDTO): boolean;
    getReactions(): Reaction[];
    addOnPlay(effectLogic: (event: GameEvent, gameDTO: GameDTO) => void): void;
    configureGenerator(): void;
    hasType(cardType: CardType): boolean;
    abstract setReactions(): void;
    abstract getCardId(): number;
    abstract getCardTypes(): CardType[];
    abstract getCost(): number;
    abstract getVictoryPoints(gameDTO: GameDTO): number;
}
declare class EmptyCardArgs {
}
declare function RegisterCard(cardType: any): void;
declare enum CardIds {
    COPPER = 0,
    WORKSHOP = 1,
    WITCH = 2,
    MOAT = 3,
    CELLAR = 4,
    LIBRARY = 5,
    GOLD = 6,
    SILVER = 7,
    CURSE = 8,
    ARTISAN = 9,
    BANDIT = 10,
    BUREAUCRAT = 11,
    CHAPEL = 12,
    COUNCIL_ROOM = 13,
    DUCHY = 14,
    ESTATE = 15,
    FESTIVAL = 16,
    GARDENS = 17,
    HARBINGER = 18,
    LABORATORY = 19,
    MARKET = 20,
    MERCHANT = 21,
    MILITIA = 22,
    MINE = 23,
    MONEYLENDER = 24,
    POACHER = 25,
    PROVINCE = 26,
    REMODEL = 27,
    SENTRY = 28,
    SMITHY = 29,
    THRONE_ROOM = 30,
    VASSAL = 31,
    VILLAGE = 32
}
declare class CardState {
    uuid: string;
    zoneId: number;
    ownerUUID: string;
    constructor(uuid: string, zoneId: number, ownerUUID: string);
}
declare enum CardType {
    TREASURE = 0,
    ACTION = 1,
    VICTORY = 2,
    ATTACK = 3,
    REACTION = 4,
    CURSE = 5
}
declare class ArtisanCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class BanditCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class BureaucratCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class CellarCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class ChapelCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class CopperCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class CouncilRoomCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class CurseCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class DuchyCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class EstateCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class FestivalCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class GardensCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class GoldCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class HarbingerCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class LaboratoryCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class LibraryCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class MarketCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class MerchantCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class MilitiaCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class MineCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class MoatCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class MoneylenderCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class PoacherCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class ProvidenceCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class RemodelCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class SentryCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class SilverCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class SmithyCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class ThroneRoomCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class VassalCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class VillageCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class WitchCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class WorkshopCardDefinition extends CardDefinition {
    setReactions(): void;
    getCost(): number;
    getVictoryPoints(gameDTO: GameDTO): number;
    getCardId(): number;
    getCardTypes(): CardType[];
}
declare class AIPlayer {
    uuid: string;
    playerUUIDMappedTo: string;
    gameDTO: GameDTO;
    constructor(gameDTO: GameDTO, playerUUIDMappedTo: string);
    doTurn(gameDTO: GameDTO): void;
    makePlayerChoice(options: string[], prepositionType: PlayerChoicePrepositionValues, prepositionValue: number): any[];
}
declare class ChosenMoveReceiver {
    receive(move: Move, gameDTO: GameDTO): void;
    validate(): void;
    process(move: Move, gameDTO: GameDTO): void;
}
declare class GlobalAIConfig {
    static AUTORUN: boolean;
}
declare class PossibleMovesGenerator {
    generate(playerUUID: string, gameDTO: GameDTO): Move[];
}
declare enum MoveType {
    PLAY = 0,
    BUY = 1,
    ADVANCE_PHASE = 2,
    CHOICE = 3
}
declare abstract class Move {
    static MOVE_GENERATORS: any;
    abstract execute(gameDTO: GameDTO): any;
    abstract getMoveType(): any;
    static fromJson(json: any): Move;
    static toJsonObject(moveObject: Move, gameDTO: GameDTO): any;
    static registerMoveGenerator(id: MoveType, generator: () => Move): void;
    static create(moveType: MoveType): Move;
    configureGenerator(): void;
}
declare function RegisterMove(moveType: any): void;
declare class AdvancePhaseMove extends Move {
    execute(gameDTO: GameDTO): void;
    getMoveType(): MoveType;
}
declare class BuyMove extends Move {
    cardToBuy: string;
    playerToGain: string;
    constructor(playerToGain: string, cardToBuy: string);
    execute(gameDTO: GameDTO): void;
    getMoveType(): MoveType;
    toString(gameDTO: GameDTO): string;
}
declare class ChoiceMove extends Move {
    choices: any;
    options: any;
    maxChoicesNum: number;
    minChoicesNum: number;
    choiceString: string;
    choiceType: PlayerChoiceType;
    constructor(choiceType: PlayerChoiceType, choices: any, options: any, minChoicesNum: number, maxChoicesNum: number, choiceString: string);
    execute(gameDTO: GameDTO): void;
    getMoveType(): MoveType;
}
declare class PlayMove extends Move {
    cardToPlay: string;
    constructor(cardToPlay: string);
    execute(gameDTO: GameDTO): void;
    getMoveType(): MoveType;
    toString(gameDTO: GameDTO): string;
}
declare enum Phase {
    ACTION = 0,
    BUY = 1,
    CLEAN_UP = 2
}
declare enum Zones {
    SUPPLY = 0,
    DECK = 1,
    HAND = 2,
    IN_PLAY = 3,
    DISCARD_PILE = 4,
    TRASH = 5,
    REVEALED = 6
}
declare abstract class DTO {
}
interface DTOCompatible<V extends DTO> {
    convertToDTO(): V;
}
declare class GameDTO extends DTO {
    players: GameDTO_Player[];
    cards: GameDTO_Card[];
    engine: GameDTO_Engine;
    state: GameDTO_State;
}
declare class GameDTO_Engine extends DTO {
    logicalStack: GameDTO_LogicalBuffer[];
    reactionStack: GameDTO_ReactionBuffer[];
    eventStack: GameDTO_EventEntry[];
}
declare class GameDTO_Player extends DTO {
    uuid: string;
    name: string;
    turn: GameDTO_Player_Turn;
}
declare class GameDTO_Player_Turn extends DTO {
    money: number;
    actions: number;
    buys: number;
}
declare class GameDTO_Card extends DTO {
    uuid: string;
    definitionId: number;
    zoneId: number;
    ownerUUID: string;
    zoneIndex: number;
}
declare class GameDTO_LogicalBuffer extends DTO {
    uuid: string;
    currentStep: string;
    steps: GameDTO_LogicalBuffer_Step[];
    storedData: {};
}
declare class GameDTO_LogicalBuffer_Step extends DTO {
    uuid: string;
    stepId: number;
    args: {};
}
declare class GameDTO_LogicalBufferVariable extends DTO {
    type: number;
    value: string;
}
declare class GameDTO_EventEntry extends DTO {
    eventUUID: string;
    eventId: number;
    sourceType: EventSourceType;
    sourceUUID: string;
    reactionsPolled: boolean;
    status: EventStatus;
    args: {};
}
declare class GameDTO_State extends DTO {
    state: GameState;
    turnPlayer: string;
    phase: Phase;
    unaffectedPlayers: any[];
}
declare class GameDTO_ReactionBuffer extends DTO {
    potentialReactions: ReactionKey[];
    eventUUIDReactingTo: string;
    eventStatus: EventStatus;
}
declare class GameDTOAccess {
    static setPlayerChoice(gameDTO: GameDTO, chosenOptions: any[]): any;
    static traverseLogicalStep(gameDTO: GameDTO, currentBuffer: LogicalBuffer, currentStep: LogicalStep): any;
    static changeTurns(gameDTO: GameDTO): any;
    static removeTopReactionBuffer(gameDTO: GameDTO): any;
    static removeLogicalBuffer(gameDTO: GameDTO, bufferToRemove: LogicalBuffer): any;
    static removeEvent(gameDTO: GameDTO, eventToRemove: GameEvent): any;
    static updateEvent(gameDTO: GameDTO, updatingEvent: GameEvent): void;
    static pushNewReactionBuffer(gameDTO: GameDTO, newReactionBuffer: ReactionBuffer): any;
    static getReactionStack(gameDTO: GameDTO): ReactionStack;
    static getEventStack(gameDTO: GameDTO): EventStack;
    static getLogicalStack(gameDTO: GameDTO): LogicalStack;
    static getEvent(gameDTO: GameDTO, eventUUID: string): any;
    static getTopEvent(gameDTO: GameDTO): GameEvent;
    static updateLogicalBuffer(gameDTO: GameDTO, logicalBuffer: LogicalBuffer): void;
    static getTopLogicalBuffer(gameDTO: GameDTO): LogicalBuffer;
    static isEventStackCleared(gameDTO: GameDTO): boolean;
    static isLogicalStackCleared(gameDTO: GameDTO): boolean;
    static isReactionStackCleared(gameDTO: GameDTO): boolean;
    static rebalanceZone(gameDTO: GameDTO, playerUUID: string, zoneId: Zones): any;
    static isGameOver(gameDTO: GameDTO): any;
    static getObjectForUUID(gameDTO: GameDTO, uuid: string): any;
    static setState(gameDTO: GameDTO, state: GameState): any;
    static setTurn(gameDTO: GameDTO, turnPlayerUUID: string): any;
    static removePlayerUnaffectedByEffect(gameDTO: GameDTO, recipient: string, cardProtectedFrom: number): any;
    static setPlayerUnaffectedByEffect(gameDTO: GameDTO, recipient: string, cardProtectedFrom: number): any;
    static shuffleDeck(gameDTO: GameDTO, recipient: string): void;
    static getCardDTOsInZone(gameDTO: GameDTO, recipient: string, zone: Zones): GameDTO_Card[];
    static setDeckIndex(gameDTO: GameDTO, cardUUID: string, newIndex: any): any;
    static getAllCardsOwnedBy(gameDTO: GameDTO, ownerUUID: string): string[];
    static countEmptySupplyPiles(gameDTO: GameDTO): number;
    static getCardsInZone(gameDTO: GameDTO, ownerUUID: string, zone: Zones): string[];
    static pushEventsToStack(gameDTO: GameDTO, arg1: GameEvent[]): any;
    static getVictoriesInHand(gameDTO: GameDTO, uuid: any): string[];
    static isPlayerUnaffectedByCard(gameDTO: GameDTO, playerUUID: any, cardUUID: string): any;
    static getNextCardInSupplyPile(gameDTO: GameDTO, cardId: CardIds): string;
    static getCardsInPile(gameDTO: GameDTO, cardId: CardIds): string[];
    static getCardsOnDeck(gameDTO: GameDTO, ownerUUID: string, numberToGet: number): any;
    static getCardDefinition(gameDTO: GameDTO, cardUUID: string): CardDefinition;
    static getCardDTO(gameDTO: GameDTO, uuid: string): GameDTO_Card;
    static getOwner(gameDTO: GameDTO, uuid: string): string;
    static getOwnerDTO(gameDTO: GameDTO, uuid: string): GameDTO_Player;
    static getPlayers(gameDTO: GameDTO): any;
    static getTopCardOfDeck(gameDTO: GameDTO, recipient: string): string;
    static setOwner(gameDTO: GameDTO, chosenCard: string, recipient: string): any;
    static pushNewLogicalBuffer(gameDTO: GameDTO, buffer: LogicalBuffer): void;
    static setZone(gameDTO: GameDTO, cardUUID: string, zoneId: number): void;
    static pushEventToStack(gameDTO: GameDTO, event: GameEvent): void;
    static getCardFromUUID(game: GameDTO, cardUuid: string): GameDTO_Card;
    static getPlayerFromUUID(game: GameDTO, playerUUID: string): GameDTO_Player;
    static getPlayerUUIDs_asStringArray(game: GameDTO): string[];
    static getAvailableCardTypesInSupply(gameDTO: GameDTO): number[];
}
declare class GameDTOTransform {
    static createFromJSON(json: string): GameDTO;
    static obj2Instance(object: any, type: any): any;
}
declare class EngineSource {
    type: EngineSourceType;
    uuid: string;
}
declare enum EngineSourceType {
    LOGICAL = 0,
    REACTION = 1,
    EVENT = 2,
    USER = 3
}
declare class GameDriver {
    gameDTO: GameDTO;
    waiting: boolean;
    constructor(gameDTO: GameDTO);
    process(): void;
    step(): boolean;
}
declare enum GameState {
    NOT_STARTED = 0,
    START = 1,
    TURN_WAITING = 2,
    RESOLVING_LOGICAL_STACK = 3,
    RESOLVING_REACTION_STACK = 4,
    RESOLVING_EVENT_STACK = 5,
    WAITING_FOR_PLAYER_CHOICE = 6,
    END = 7
}
declare var alert: any;
declare class GamePopulator {
    static kingdomCards: CardIds[];
    static otherSupplyCards: number[][];
    static populate(gameDTO: GameDTO): void;
    static setFirstTurn(gameDTO: GameDTO): void;
    static populateCards(gameDTO: GameDTO): void;
    static populateUsers(gameDTO: GameDTO): void;
    static openingDecks(gameDTO: GameDTO): void;
    static openingDraws(gameDTO: GameDTO): void;
    static createNewCardDTO(gameDTO: GameDTO, id: CardIds, ownerUUID: string): GameDTO_Card;
}
declare class EventArgs {
    data: {};
    add(key: string, value: LogicalVariable): this;
}
declare enum EventIds {
    CARD_PLAYED = 0,
    ADD_MONEY = 1,
    GAIN_CARD = 2,
    DRAW_CARD = 3,
    SET_UNAFFECTED = 4,
    REVEAL_CARD = 5,
    DISCARD_CARD = 6,
    TRASH_CARD = 7,
    SET_CARD_ONTO_DECK = 8,
    PLACE_IN_DECK = 9,
    ADD_ACTION = 10,
    ADD_BUYS = 11,
    RESHUFFLE_DECK = 12,
    ADVANCE_PHASE = 13
}
declare enum EventSourceType {
    CARD = 0,
    PLAYER = 1
}
declare class EventStack {
    events: GameEvent[];
    static currentOutput: EventStackOutput;
    processAndAdvance(gameDTO: GameDTO): EventStackOutput;
}
declare class EventStackOutput {
    isEmpty: boolean;
    isCurrentBufferComplete: boolean;
    reactionsGenerated: boolean;
}
declare enum EventStatus {
    DECLARED = 0,
    RESOLVING = 1,
    RESOLVED = 2
}
declare abstract class GameEvent {
    status: EventStatus;
    reactionsPolled: boolean;
    eventSource: EventSourceType;
    eventSourceUUID: string;
    uuid: string;
    args: {};
    static EVENT_DEFINITION: {};
    constructor(eventSource: EventSourceType, eventSourceUUID: string, args: {});
    static create(eventId: EventIds, args: {}): GameEvent;
    static createWithStatus(eventId: EventIds, status: EventStatus, args: {}): GameEvent;
    static createFromDTO(dto: GameDTO_EventEntry): GameEvent;
    convertToDTO(): GameDTO_EventEntry;
    abstract populateFromArgs(args: {}): void;
    abstract getId(): number;
    abstract execute(gameDTO: GameDTO): void;
    static registerCardGenerator(id: number, generator: (args: {}) => GameEvent): void;
    configureGenerator(): void;
}
declare function RegisterEvent(gameEventType: any): void;
declare class AddActionEvent extends GameEvent {
    static PLAYER_UUID: string;
    static AMOUNT: string;
    playerToAddActionToUUID: string;
    amount: number;
    populateFromArgs(args: {}): void;
    getId(): number;
    execute(gameDTO: GameDTO): void;
}
declare class AddActionEventArgs extends EventArgs {
    constructor(playerUUID: LogicalVariable, amount: LogicalVariable);
}
declare class AddBuysEvent extends GameEvent {
    static PLAYER_UUID: string;
    static AMOUNT: string;
    playerToAddMoneyToUUID: string;
    amount: number;
    populateFromArgs(args: {}): void;
    getId(): number;
    execute(gameDTO: GameDTO): void;
}
declare class AddBuysEventArgs extends EventArgs {
    constructor(playerUUID: LogicalVariable, amount: LogicalVariable);
}
declare class AddMoneyEvent extends GameEvent {
    static PLAYER_UUID: string;
    static AMOUNT: string;
    playerToAddMoneyToUUID: string;
    amount: number;
    populateFromArgs(args: {}): void;
    getId(): number;
    execute(gameDTO: GameDTO): void;
}
declare class AddMoneyEventArgs extends EventArgs {
    constructor(playerUUID: LogicalVariable, amount: LogicalVariable);
}
declare class AdvancePhaseEvent extends GameEvent {
    populateFromArgs(args: {}): void;
    getId(): number;
    execute(gameDTO: GameDTO): void;
}
declare class CardPlayedEvent extends GameEvent {
    static CARD_UUID: string;
    CARD_UUID: string;
    execute(gameDTO: GameDTO): void;
    populateFromArgs(args: {}): void;
    getId(): number;
}
declare class CardPlayedEventArgs extends EventArgs {
    constructor(cardUUID: LogicalVariable);
}
declare class DiscardCardsEvent extends GameEvent {
    static CHOSEN_CARD: string;
    chosenCard: string;
    populateFromArgs(args: {}): void;
    getId(): number;
    execute(gameDTO: GameDTO): void;
}
declare class DiscardCardsEventArgs extends EventArgs {
    constructor(chosenCard: LogicalVariable);
}
declare class DrawCardsEvent extends GameEvent {
    static RECIPIENT: string;
    recipient: string;
    amount: number;
    populateFromArgs(args: {}): void;
    getId(): number;
    execute(gameDTO: GameDTO): void;
}
declare class DrawCardsEventArgs extends EventArgs {
    constructor(recipient: LogicalVariable);
}
declare class GainCardEvent extends GameEvent {
    static GAIN_LOCATION: string;
    static RECIPIENT: string;
    static CHOSEN_CARD: string;
    recipient: string;
    chosenCard: string;
    gainLocation: Zones;
    populateFromArgs(args: {}): void;
    getId(): number;
    execute(gameDTO: GameDTO): void;
}
declare class GainCardEventArgs extends EventArgs {
    constructor(recipient: LogicalVariable, chosenCard: LogicalVariable, gainLocation?: LogicalVariable);
}
declare class PlaceInDeckEvent extends GameEvent {
    static CARD_UUID: string;
    static INDEX: string;
    cardUUID: string;
    index: string;
    populateFromArgs(args: {}): void;
    getId(): number;
    execute(gameDTO: GameDTO): void;
}
declare class PlaceInDeckEventArgs extends EventArgs {
    constructor(cardUUID: LogicalVariable, index: LogicalVariable);
}
declare class PlaceInDeckEventOptions {
    static TOP: string;
    static BOTTOM: string;
}
declare class ReshuffleDeckEvent extends GameEvent {
    static WHOSE_DECK: string;
    recipient: string;
    populateFromArgs(args: {}): void;
    getId(): number;
    execute(gameDTO: GameDTO): void;
}
declare class ReshuffleDeckEventArgs extends EventArgs {
    constructor(whose: LogicalVariable);
}
declare class RevealCardEvent extends GameEvent {
    static CARD_UUID: string;
    chosenCard: string;
    execute(gameDTO: GameDTO): void;
    populateFromArgs(args: {}): void;
    getId(): number;
}
declare class RevealCardEventArgs extends EventArgs {
    constructor(cardUUID: LogicalVariable);
}
declare class SetCardOntoDeckEvent extends GameEvent {
    static AFFECTED_PLAYER: string;
    static CHOSEN_CARD: string;
    recipient: string;
    chosenCard: string;
    populateFromArgs(args: {}): void;
    getId(): number;
    execute(gameDTO: GameDTO): void;
}
declare class SetCardOntoDeckEventArgs extends EventArgs {
    constructor(affectedPlayers: LogicalVariable, chosenCard: LogicalVariable);
}
declare class SetUnaffectedEvent extends GameEvent {
    static PROTECTED_PLAYER: string;
    static PROTECTED_FROM: string;
    static ACTION: string;
    recipient: string;
    action: SetUnaffectedEventAction;
    cardProtectedFrom: number;
    populateFromArgs(args: {}): void;
    getId(): number;
    execute(gameDTO: GameDTO): void;
}
declare class SetUnaffectedEventArgs extends EventArgs {
    constructor(protectedPlayer: LogicalVariable, protectedFrom: LogicalVariable, action: LogicalVariable);
}
declare enum SetUnaffectedEventAction {
    SET = 0,
    REMOVE = 1
}
declare class TrashCardsEvent extends GameEvent {
    static CARD_UUID: string;
    chosenCard: string;
    populateFromArgs(args: {}): void;
    getId(): number;
    execute(gameDTO: GameDTO): void;
}
declare class TrashCardsEventArgs extends EventArgs {
    constructor(cardUUID: LogicalVariable);
}
declare class LogicalBuffer {
    uuid: string;
    currentStepUUID: string;
    steps: LogicalStep[];
    storedData: {};
    isComplete: boolean;
    addStep(step: LogicalStep): void;
    addSteps(...steps: LogicalStep[]): void;
    addAllSteps(steps: LogicalStep[]): void;
    processAndAdvance(gameDTO: GameDTO): boolean;
    getCurrentStep(): LogicalStep;
    static createFromDTO(dto: GameDTO_LogicalBuffer, gameDTO: GameDTO): LogicalBuffer;
    convertToDTO(gameDTO: GameDTO): GameDTO_LogicalBuffer;
    reset(): void;
}
declare class LogicalStack {
    buffers: LogicalBuffer[];
    static currentOutput: LogicalStackOutput;
    processAndAdvance(gameDTO: GameDTO): LogicalStackOutput;
}
declare class LogicalStackOutput {
    isEmpty: boolean;
    isCurrentBufferComplete: boolean;
    eventsGenerated: boolean;
    isPlayerWaiting: boolean;
}
declare abstract class LogicalStep implements DTOCompatible<GameDTO_LogicalBuffer_Step> {
    static STEP_DEFINITION: {};
    uuid: string;
    constructor();
    abstract processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    abstract getStepId(): StepId;
    abstract constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): any;
    abstract convertToDTO(): GameDTO_LogicalBuffer_Step;
    abstract reset(): void;
    abstract hasSubsteps(): boolean;
    abstract getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
    configureGenerator(): void;
    static createFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
    static registerCardGenerator(id: number, generator: (dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO) => CardDefinition): void;
    static create(id: number, dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
}
declare function RegisterEventBufferStep(stepType: any): void;
declare class LogicalUtils {
    Value(value: any): LogicalValue;
    Reference(value: any): LogicalReference;
    Exactly(value: LogicalVariable): PlayerChoicePreposition;
    UpTo(value: LogicalVariable): PlayerChoicePreposition;
    CreateEvent(eventId: EventIds, eventGeneratorArgs: EventArgs): GameEvent;
    ResolveVariable(variable: LogicalVariable, logicalBuffer: LogicalBuffer): any;
    SerializeString2DTOMap(valueMap: any): {};
    SerializeDTOArray(dtoArray: any): any[];
}
declare enum LogicalVariableType {
    VALUE = 0,
    REFERENCE = 1
}
declare abstract class LogicalVariable {
    type: LogicalVariableType;
    value: any;
    constructor(value: any);
    convertToDTO(): GameDTO_LogicalBufferVariable;
    static generateFromDTO(dto: GameDTO_LogicalBufferVariable): LogicalValue | LogicalReference;
}
declare class LogicalValue extends LogicalVariable {
    type: LogicalVariableType;
}
declare class LogicalReference extends LogicalVariable {
    type: LogicalVariableType;
}
declare enum StepId {
    JUMP_TO_STEP = 0,
    CONDITIONAL = 1,
    CONTAINS = 2,
    DRAW_CARDS = 3,
    EVENT_GENERATOR = 4,
    FOR_EACH = 5,
    LOAD_CARD = 6,
    LOAD_DECK = 7,
    LOAD_HAND = 8,
    LOOP = 9,
    PLAYER_CHOICE = 10,
    RELATIONAL = 11,
    QUERY = 12,
    COUNT = 13,
    ARRAY = 14,
    MATH = 15
}
declare enum ArrayStepOptions {
    ADD = 0
}
declare class ArrayStep extends LogicalStep {
    option: ArrayStepOptions;
    logicalBufferReferenceValue: LogicalVariable;
    logicalBufferReturnKey: string;
    constructor(option: ArrayStepOptions, logicalBufferReferenceValue: LogicalVariable, logicalBufferReturnKey: string);
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    getStepId(): StepId;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
    reset(): void;
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
}
declare abstract class CompoundStep extends LogicalStep {
    currentSubstepIndex: number;
    substeps: LogicalStep[];
    constructor(substeps: LogicalStep[]);
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    reset(): void;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
}
declare class ConditionalStep extends LogicalStep {
    conditionalBufferVariable: LogicalVariable;
    valueMap: {};
    currentSubstepIndex: number;
    constructor(conditionalBufferVariable: LogicalVariable, valueMap: {});
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    reset(): void;
    getStepId(): StepId;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
}
declare class ContainsStep extends LogicalStep {
    valueToCheckFor: LogicalVariable;
    setToCheckIn: LogicalVariable;
    stepsToPerform: LogicalStep[];
    currentSubstepIndex: number;
    doesntContain: boolean;
    static DOES_NOT_CONTAIN: boolean;
    constructor(valueToCheckFor: LogicalVariable, setToCheckIn: LogicalVariable, stepsToPerform: LogicalStep[], doesntContain?: boolean);
    hasSubsteps(): boolean;
    reset(): void;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    getStepId(): StepId;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
}
declare class CountStep extends LogicalStep {
    setOne: LogicalVariable;
    logicalBufferReturnKey: string;
    constructor(setOne: LogicalVariable, logicalBufferReturnKey: string);
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
    reset(): void;
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    getStepId(): StepId;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
}
declare class DrawCardsStep extends CompoundStep {
    constructor(ownerUUID: string, amount: LogicalVariable);
    getStepId(): StepId;
}
declare class EventGeneratorStep extends LogicalStep {
    eventId: EventIds;
    eventGeneratorArgs: EventArgs;
    constructor(eventId: any, eventGeneratorArgs: any);
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    getStepId(): StepId;
    reset(): void;
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
}
declare class ForEachStep extends LogicalStep {
    currentSubstepIndex: number;
    stepsToLoop: LogicalStep[];
    listVariable: LogicalVariable;
    eachReferenceTag: string;
    currentListIndex: number;
    constructor(listVariable: LogicalVariable, eachReferenceTag: string, stepsToLoop: LogicalStep[]);
    reset(): void;
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    getStepId(): StepId;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
}
declare class JumpToStep extends LogicalStep {
    stepUUID: LogicalVariable;
    constructor(stepUUID: LogicalVariable);
    reset(): void;
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
    getStepId(): StepId;
}
declare enum LoadCardInfoStepOptions {
    TYPES = 0,
    CARD_ID = 1
}
declare class LoadCardInfoStep extends LogicalStep {
    option: LoadCardInfoStepOptions;
    logicalBufferReference: LogicalVariable;
    logicalBufferReturnKey: string;
    constructor(option: LoadCardInfoStepOptions, logicalBufferReference: LogicalVariable, logicalBufferReturnKey: string);
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    reset(): void;
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
    getStepId(): StepId;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
}
declare enum LoadDeckInfoStepOptions {
    TOP_CARD = 0,
    DECK_SIZE = 1
}
declare class LoadDeckStepCardAtIndexFromTopOption {
    indexFromTop: number;
    constructor(indexFromTop: number);
}
declare class LoadDeckInfoStep extends LogicalStep {
    option: LoadDeckInfoStepOptions | LoadDeckStepCardAtIndexFromTopOption;
    logicalBufferReferencePlayerUUID: LogicalVariable;
    logicalBufferReturnKey: string;
    constructor(option: LoadDeckInfoStepOptions | LoadDeckStepCardAtIndexFromTopOption, logicalBufferReferencePlayerUUID: LogicalVariable, logicalBufferReturnKey: string);
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    reset(): void;
    getStepId(): StepId;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
}
declare enum LoadHandInfoStepOptions {
    ALL = 0,
    SIZE = 1
}
declare class LoadHandInfoStep extends LogicalStep {
    option: LoadHandInfoStepOptions;
    logicalBufferReferencePlayerUUID: LogicalVariable;
    logicalBufferReturnKey: string;
    constructor(option: LoadHandInfoStepOptions, logicalBufferReferencePlayerUUID: LogicalVariable, logicalBufferReturnKey: string);
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    getStepId(): StepId;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
    reset(): void;
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
}
declare class LoopStep extends LogicalStep {
    currentLoopIteration: number;
    currentSubstepIndex: number;
    amount: LogicalVariable;
    stepsToLoop: LogicalStep[];
    constructor(amount: LogicalVariable, stepsToLoop: LogicalStep[]);
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    reset(): void;
    getStepId(): StepId;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
}
declare enum MathStepOptions {
    MIN = 0
}
declare class MathStep extends LogicalStep {
    logicalBufferReferenceArguments: LogicalVariable[];
    option: MathStepOptions;
    logicalBufferReturnKey: string;
    constructor(logicalBufferReferenceArguments: LogicalVariable[], option: MathStepOptions, logicalBufferReturnKey: string);
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    getStepId(): StepId;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
    reset(): void;
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
}
declare enum PlayerChoiceType {
    CARD = 0,
    STRING = 1
}
declare enum PlayerChoicePrepositionValues {
    EXACTLY = 0,
    UP_TO = 1
}
declare class PlayerChoicePreposition {
    type: PlayerChoicePrepositionValues;
    value: LogicalVariable;
    constructor(type: PlayerChoicePrepositionValues, value: LogicalVariable);
}
declare class PlayerChoiceStep extends LogicalStep {
    playerUUID: LogicalVariable;
    choiceType: PlayerChoiceType;
    options: LogicalVariable;
    logicalBufferReturnKey: string;
    preposition: PlayerChoicePreposition;
    hasBeenFulfilled: boolean;
    displayText: string;
    constructor(playerUUID: LogicalVariable, choiceType: PlayerChoiceType, options: LogicalVariable, preposition: PlayerChoicePreposition, logicalBufferReturnKey: string, displayText: string);
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    fulfill(answers: any, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    getStepId(): StepId;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
    reset(): void;
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
}
declare enum QueryStepOptions {
    NOT_IN = 0,
    IN = 1
}
declare class QueryStep extends LogicalStep {
    setOne: LogicalVariable;
    option: QueryStepOptions;
    setTwo: LogicalVariable;
    logicalBufferReturnKey: string;
    constructor(setOne: LogicalVariable, option: QueryStepOptions, setTwo: LogicalVariable, logicalBufferReturnKey: string);
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    reset(): void;
    getStepId(): StepId;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
}
declare enum RelationalOptions {
    GREATER_THAN_EQ = 0,
    LESS_THAN = 1,
    EQUALS = 2,
    GREATER_THAN = 3,
    NOT_EQ = 4
}
declare class RelationalStep extends LogicalStep {
    firstOperand: LogicalVariable;
    relationalOption: RelationalOptions;
    secondOperand: LogicalVariable;
    stepsToPerform: LogicalStep[];
    hasBeenReset: boolean;
    currentSubstepIndex: number;
    constructor(firstOperand: LogicalVariable, relationalOption: RelationalOptions, secondOperand: LogicalVariable, stepsToPerform: LogicalStep[]);
    processAndAdvance(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): boolean;
    getStepId(): StepId;
    reset(): void;
    constructFromDTO(dto: GameDTO_LogicalBuffer_Step, logicalBuffer: LogicalBuffer, gameDTO: GameDTO): void;
    convertToDTO(): GameDTO_LogicalBuffer_Step;
    hasSubsteps(): boolean;
    getCurrentSubstep(logicalBuffer: LogicalBuffer, gameDTO: GameDTO): LogicalStep;
}
declare class Reaction {
    validStatusCheck: EventStatus;
    canActivate: (event: any, gameDTO: any) => boolean;
    effectLogic: (event: any, gameDTO: any) => void;
    constructor(status: EventStatus, canActivate: (event: any, gameDTO: any) => boolean, effectLogic: (event: any, gameDTO: any) => void);
}
declare class ReactionBuffer implements DTOCompatible<GameDTO_ReactionBuffer> {
    eventUUID: string;
    eventStatus: EventStatus;
    entries: ReactionKey[];
    constructor(eventUUID: string, eventStatus: EventStatus, entries: ReactionKey[]);
    processAndAdvance(gameDTO: GameDTO): boolean;
    convertToDTO(): GameDTO_ReactionBuffer;
    static REACTIVES_COMPONENTS: {};
    static RegisterReactiveComponent: (key: ReactionKey, component: (gameDTO: GameDTO, uuid: string) => Reactive) => void;
    static GetReactiveComponent: (gameDTO: GameDTO, key: ReactionKey) => Reactive;
    static pollReactions(event: GameEvent, gameDTO: GameDTO): ReactionKey[];
}
declare class ReactionKey {
    type: ReactionSourceType;
    id: string;
    constructor(type: ReactionSourceType, id: string);
    static fromString(str: string): ReactionKey;
}
declare enum ReactionSourceType {
    CARD = 0,
    SYSTEM = 1
}
declare class ReactionStack {
    buffers: ReactionBuffer[];
    static currentOutput: ReactionStackOutput;
    processAndAdvance(gameDTO: GameDTO): ReactionStackOutput;
}
declare class ReactionStackOutput {
    isEmpty: boolean;
    createdLogicalOutput: boolean;
    currentBufferFinished: boolean;
}
interface Reactive {
    getReactions(): Reaction[];
}
declare class CleanUpReaction implements Reactive {
    reactions: Reaction[];
    getReactions(): Reaction[];
    constructor();
}
declare class DriverNotify {
    static DRIVER_EVENT: string;
    static ping(): void;
    static subscribe(callback: (any: any) => void): void;
}
declare class GameDisplayFeed {
    static GAME_FEED_EVENT: string;
    static send(gameDTO: GameDTO, action: string): void;
    static subscribe(callback: (gameDTO: GameDTO, action: string) => void): void;
}
declare class MessagingCenter {
    private static pubSubMap;
    static addListener(event: string, callback: (any: any) => void, removeOnCompletion: boolean): void;
    static notify(event: string, payload: any): void;
}
declare class Log {
    static LOG_EVENT: string;
    static send(messageString: string): void;
    static subscribe(callback: (any: any) => void): void;
}
declare class MessageCallback {
    callback: (any: any) => void;
    removeOnCompletion: boolean;
    id: number;
    constructor(callback: (any: any) => void, removeOnCompletion: boolean, id: number);
}
declare class PlayerChoiceNotify {
    static PLAYER_CHOICE: string;
    static send(playerUUID: string, options: string[], prepositionType: PlayerChoicePrepositionValues, prepositionValue: number): void;
    static subscribe(callback: (playerUUID: string, options: string[], prepositionType: PlayerChoicePrepositionValues, prepositionValue: number) => void): void;
}
declare class TurnNotify {
    static TURN_EVENT: string;
    static send(turnPlayer: string): void;
    static subscribe(callback: (turnPlayer: any) => void): void;
}
declare class LoggingUtils {
    gameDTO: GameDTO;
    constructor(gameDTO: GameDTO);
    fname(objectUUID: any): string;
    owner(cardUUID: any): string;
}
declare function UUID(): string;
declare class Util {
    static contains(a: any[], obj: any): boolean;
    static shuffle(array: any[]): any[];
    static randomInRange(min: number, max: number): number;
    static isArray(obj: any): boolean;
    static convertToArray(value: any): any;
    static isNumber(n: any): boolean;
}
