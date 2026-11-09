package com.pierreo.projet_devoir_po.application.addition;

import com.pierreo.projet_devoir_po.application.addition.exception.AdditionExerciseNotFoundException;
import com.pierreo.projet_devoir_po.domain.addition.AdditionDifficulty;
import com.pierreo.projet_devoir_po.domain.addition.AdditionExercise;
import com.pierreo.projet_devoir_po.domain.addition.AdditionExerciseGenerator;
import com.pierreo.projet_devoir_po.domain.addition.AdditionExerciseRepository;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@RequiredArgsConstructor
public class AdditionExerciseService {

    private final AdditionExerciseGenerator generator;
    private final AdditionExerciseRepository repository;

    public CreatedAdditionExercise createExercise() {
        return createExercise(AdditionDifficulty.EASY);
    }

    public CreatedAdditionExercise createExercise(AdditionDifficulty difficulty) {
        AdditionExercise exercise = generator.generate(difficulty);

        UUID exerciseId = UUID.randomUUID();

        repository.save(exerciseId, exercise);

        return new CreatedAdditionExercise(exerciseId, exercise.getFirstOperand(), exercise.getSecondOperand());
    }

    public boolean checkAnswer(UUID exerciseId, int answer) {
        AdditionExercise exercise = repository.findById(exerciseId)
                .orElseThrow(() ->
                        new AdditionExerciseNotFoundException(exerciseId)
                );

        return exercise.isCorrectAnswer(answer);
    }
}
