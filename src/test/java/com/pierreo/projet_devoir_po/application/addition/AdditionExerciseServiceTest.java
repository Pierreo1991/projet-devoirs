package com.pierreo.projet_devoir_po.application.addition;

import com.pierreo.projet_devoir_po.application.addition.exception.AdditionExerciseNotFoundException;
import com.pierreo.projet_devoir_po.domain.addition.AdditionDifficulty;
import com.pierreo.projet_devoir_po.domain.addition.AdditionExercise;
import com.pierreo.projet_devoir_po.domain.addition.AdditionExerciseGenerator;
import com.pierreo.projet_devoir_po.domain.addition.AdditionExerciseRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AdditionExerciseServiceTest {

    @Test
    void givenGeneratedExercise_whenCreatingExercise_thenSavesAndReturnsExercise() {
        // Arrange
        AdditionExerciseGenerator generator = mock(AdditionExerciseGenerator.class);
        AdditionExerciseRepository repository = mock(AdditionExerciseRepository.class);

        AdditionExercise exercise = new AdditionExercise(3, 8);

        when(generator.generate(AdditionDifficulty.EASY)).thenReturn(exercise);

        AdditionExerciseService service = new AdditionExerciseService(generator, repository);

        // Act
        CreatedAdditionExercise result = service.createExercise();

        // Assert
        assertNotNull(result.exerciseId());
        assertEquals(3, result.firstOperand());
        assertEquals(8, result.secondOperand());

        verify(generator).generate(AdditionDifficulty.EASY);
        verify(repository).save(eq(result.exerciseId()), same(exercise));
    }

    @Test
    void givenExistingExercise_whenAnswerIsCorrect_thenReturnsTrue() {
        // Arrange
        AdditionExerciseGenerator generator = mock(AdditionExerciseGenerator.class);
        AdditionExerciseRepository repository = mock(AdditionExerciseRepository.class);

        UUID exerciseId = UUID.randomUUID();
        AdditionExercise exercise = new AdditionExercise(3, 8);

        when(repository.findById(exerciseId)).thenReturn(Optional.of(exercise));

        AdditionExerciseService service = new AdditionExerciseService(generator, repository);

        // Act
        boolean result = service.checkAnswer(exerciseId, 11);

        // Assert
        assertTrue(result);
        verify(repository).findById(exerciseId);
    }

    @Test
    void givenExistingExercise_whenAnswerIsIncorrect_thenReturnsFalse() {
        // Arrange
        AdditionExerciseGenerator generator = mock(AdditionExerciseGenerator.class);
        AdditionExerciseRepository repository = mock(AdditionExerciseRepository.class);

        UUID exerciseId = UUID.randomUUID();
        AdditionExercise exercise = new AdditionExercise(3, 8);

        when(repository.findById(exerciseId)).thenReturn(Optional.of(exercise));

        AdditionExerciseService service = new AdditionExerciseService(generator, repository);

        // Act
        boolean result = service.checkAnswer(exerciseId, 10);

        // Assert
        assertFalse(result);
        verify(repository).findById(exerciseId);
    }

    @Test
    void givenNonExistingExercise_whenCheckingAnswer_thenThrowsAdditionExerciseNotFoundException() {
        // Arrange
        AdditionExerciseGenerator generator = mock(AdditionExerciseGenerator.class);
        AdditionExerciseRepository repository = mock(AdditionExerciseRepository.class);

        UUID exerciseId = UUID.randomUUID();

        when(repository.findById(exerciseId)).thenReturn(Optional.empty());

        AdditionExerciseService service = new AdditionExerciseService(generator, repository);

        // Act & Assert
        assertThrows(AdditionExerciseNotFoundException.class, () -> service.checkAnswer(exerciseId, 11));

        verify(repository).findById(exerciseId);
    }

    @Test
    void givenMediumDifficulty_whenCreatingExercise_thenSavesAndReturnsMediumExercise() {
        // Arrange
        AdditionExerciseGenerator generator = mock(AdditionExerciseGenerator.class);
        AdditionExerciseRepository repository = mock(AdditionExerciseRepository.class);

        AdditionExercise exercise = new AdditionExercise(25, 100);

        when(generator.generate(AdditionDifficulty.MEDIUM)).thenReturn(exercise);

        AdditionExerciseService service = new AdditionExerciseService(generator, repository);

        // Act
        CreatedAdditionExercise result = service.createExercise(AdditionDifficulty.MEDIUM);

        // Assert
        assertNotNull(result.exerciseId());
        assertEquals(25, result.firstOperand());
        assertEquals(100, result.secondOperand());

        verify(generator).generate(AdditionDifficulty.MEDIUM);
        verify(repository).save(eq(result.exerciseId()), same(exercise));
    }
}
