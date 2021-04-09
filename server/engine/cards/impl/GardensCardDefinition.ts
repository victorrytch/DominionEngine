class GardensCardDefinition extends CardDefinition {

    setReactions(): void {
    }


    getCost(): number {
        return 4;
    }

    getVictoryPoints(gameDTO: GameDTO): number {
        return Math.floor(GameDTOAccess.getAllCardsOwnedBy(gameDTO, this.cardState.ownerUUID).length / 10);
    }

    getCardId(): number {
        return CardIds.GARDENS;
    }

    getCardTypes(): CardType[] {
        return [CardType.VICTORY];
    }


}

RegisterCard(GardensCardDefinition);