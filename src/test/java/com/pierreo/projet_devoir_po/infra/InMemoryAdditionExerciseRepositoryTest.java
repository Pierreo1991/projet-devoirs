package com.pierreo.projet_devoir_po.infra;

import com.pierreo.projet_devoir_po.domain.addition.AdditionExercise;
import com.pierreo.projet_devoir_po.infra.addition.InMemoryAdditionExerciseRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class InMemoryAdditionExerciseRepositoryTest {

    @Test
    void givenSavedExercise_whenFindingById_thenReturnsExercise() {
        // Arrange
        InMemoryAdditionExerciseRepository repository = new InMemoryAdditionExerciseRepository();

        UUID exerciseId = UUID.randomUUID();
        AdditionExercise exercise = new AdditionExercise(3, 8);

        repository.save(exerciseId, exercise);

        // Act
        Optional<AdditionExercise> result = repository.findById(exerciseId);

        // Assert
        assertTrue(result.isPresent());
        assertSame(exercise, result.get());
    }

    @Test
    void givenUnknownExerciseId_whenFindingById_thenReturnsEmptyOptional() {
        // Arrange
        InMemoryAdditionExerciseRepository repository = new InMemoryAdditionExerciseRepository();

        UUID unknownExerciseId = UUID.randomUUID();

        // Act
        Optional<AdditionExercise> result = repository.findById(unknownExerciseId);

        // Assert
        assertTrue(result.isEmpty());
    }
}
