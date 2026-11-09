package com.pierreo.projet_devoir_po.domain.addition;

import java.util.random.RandomGenerator;

public class AdditionExerciseGenerator {
    private static final int MIN_OPERAND = 1;

    private final RandomGenerator randomGenerator;

    public AdditionExerciseGenerator(RandomGenerator randomGenerator) {
        this.randomGenerator = randomGenerator;
    }

    public AdditionExercise generate() {
        return generate(AdditionDifficulty.EASY);
    }

    public AdditionExercise generate(AdditionDifficulty difficulty) {
        int maxOperandExclusive = difficulty.getMaxOperand() + 1;

        int firstOperand = randomGenerator.nextInt(MIN_OPERAND, maxOperandExclusive);

        int secondOperand = randomGenerator.nextInt(MIN_OPERAND, maxOperandExclusive);

        return new AdditionExercise(firstOperand, secondOperand);
    }
}
