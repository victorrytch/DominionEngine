class ProvidenceCardDefinition extends CardDefinition {

    setReactions(): void {

    }


    getCost(): number {
        return 8;
    }

    getVictoryPoints(gameDTO: GameDTO): number {
        return 6;
    }

    getCardId(): number {
        return CardIds.PROVINCE;
    }

    getCardTypes(): CardType[] {
        return [CardType.VICTORY];
    }

}

RegisterCard(ProvidenceCardDefinition);
