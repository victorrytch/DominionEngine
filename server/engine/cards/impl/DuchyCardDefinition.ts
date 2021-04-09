class DuchyCardDefinition extends CardDefinition {

    setReactions(): void {

    }


    getCost(): number {
        return 5;
    }

    getVictoryPoints(gameDTO: GameDTO): number {
        return 3;
    }

    getCardId(): number {
        return CardIds.DUCHY;
    }

    getCardTypes(): CardType[] {
        return [CardType.VICTORY];
    }


}

RegisterCard(DuchyCardDefinition);