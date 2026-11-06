package com.pierreo.projet_devoir_po.domain.addition;

import org.junit.jupiter.api.Test;

import java.util.random.RandomGenerator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AdditionExerciseGeneratorTest {

    @Test
    void givenRandomOperands_whenGeneratingExercise_thenReturnsAdditionExercise() {
        // Arrange
        RandomGenerator randomGenerator = mock(RandomGenerator.class);
        when(randomGenerator.nextInt(1, 11)).thenReturn(3, 8);

        AdditionExerciseGenerator generator = new AdditionExerciseGenerator(randomGenerator);

        // Act
        AdditionExercise exercise = generator.generate();

        // Assert
        assertEquals(3, exercise.getFirstOperand());
        assertEquals(8, exercise.getSecondOperand());
    }

    @Test
    void givenBoundaryOperands_whenGeneratingExercise_thenReturnsValidExercise() {
        // Arrange
        RandomGenerator randomGenerator = mock(RandomGenerator.class);
        when(randomGenerator.nextInt(1, 11)).thenReturn(1, 10);

        AdditionExerciseGenerator generator = new AdditionExerciseGenerator(randomGenerator);

        // Act
        AdditionExercise exercise = generator.generate();

        // Assert
        assertEquals(1, exercise.getFirstOperand());
        assertEquals(10, exercise.getSecondOperand());
    }
}
