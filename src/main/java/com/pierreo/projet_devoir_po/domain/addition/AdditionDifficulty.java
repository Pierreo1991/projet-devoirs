package com.pierreo.projet_devoir_po.domain.addition;

public enum AdditionDifficulty {
    EASY(10),
    MEDIUM(100),
    HARD(1000);

    private final int maxOperand;

    AdditionDifficulty(int maxOperand) {
        this.maxOperand = maxOperand;
    }

    public int getMaxOperand() {
        return maxOperand;
    }
}