package com.pierreo.projet_devoir_po.domain.addition;

import lombok.Getter;

@Getter
public class AdditionExercise {

    int firstOperand;
    int secondOperand;

    public AdditionExercise(int firstOperand, int secondOperand) {
        this.firstOperand = firstOperand;
        this.secondOperand = secondOperand;
    }

    public boolean isCorrectAnswer(int answer) {
        return answer == firstOperand + secondOperand;
    }
}
