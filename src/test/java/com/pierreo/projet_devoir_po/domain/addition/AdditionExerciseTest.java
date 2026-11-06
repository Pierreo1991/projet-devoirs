package com.pierreo.projet_devoir_po.domain.addition;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class AdditionExerciseTest {

    @Test
    void givenTwoOperands_whenAnswerIsCorrect_thenReturnsTrue() {
        // Arrange
        AdditionExercise additionExercise = new AdditionExercise(1, 4);

        // Act
        boolean result = additionExercise.isCorrectAnswer(5);

        // Assert
        Assertions.assertTrue(result);
    }

    @Test
    void givenTwoOperands_whenAnswerIsIncorrect_thenReturnsFalse() {
        // Arrange
        AdditionExercise additionExercise = new AdditionExercise(1, 4);

        // Act
        boolean result = additionExercise.isCorrectAnswer(6);

        // Assert
        Assertions.assertFalse(result);
    }
}
