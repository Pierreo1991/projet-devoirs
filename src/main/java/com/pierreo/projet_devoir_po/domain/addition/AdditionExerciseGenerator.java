package com.pierreo.projet_devoir_po.domain.addition;

import java.util.random.RandomGenerator;

public class AdditionExerciseGenerator {
    private static final int MIN_OPERAND = 1;
    private static final int MAX_OPERAND_EXCLUSIVE = 11;

    private final RandomGenerator randomGenerator;

    public AdditionExerciseGenerator(RandomGenerator randomGenerator) {
        this.randomGenerator = randomGenerator;
    }

    public AdditionExercise generate() {
        int firstOperand = randomGenerator.nextInt(MIN_OPERAND, MAX_OPERAND_EXCLUSIVE);

        int secondOperand = randomGenerator.nextInt(MIN_OPERAND, MAX_OPERAND_EXCLUSIVE);

        return new AdditionExercise(firstOperand, secondOperand);
    }
}
