class CurseCardDefinition extends CardDefinition {

    setReactions(): void {

    }


    getCost(): number {
        return 0;
    }

    getVictoryPoints(): number {
        return -1;
    }

    getCardId(): number {
        return CardIds.CURSE;
    }

    getCardTypes(): CardType[] {
        return [CardType.CURSE];
    }




}

RegisterCard(CurseCardDefinition);