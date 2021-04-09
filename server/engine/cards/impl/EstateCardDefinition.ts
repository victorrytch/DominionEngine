class EstateCardDefinition extends CardDefinition {

    setReactions(): void {
    }


    getCost(): number {
        return 2;
    }

    getVictoryPoints(gameDTO: GameDTO): number {
        return 1;
    }

    getCardId(): number {
        return CardIds.ESTATE;
    }

    getCardTypes(): CardType[] {
        return [CardType.VICTORY];
    }



}

RegisterCard(EstateCardDefinition);