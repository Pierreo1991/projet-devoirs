package com.pierreo.projet_devoir_po.infra.addition;

import com.pierreo.projet_devoir_po.domain.addition.AdditionExercise;
import com.pierreo.projet_devoir_po.domain.addition.AdditionExerciseRepository;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class InMemoryAdditionExerciseRepository implements AdditionExerciseRepository {

    private final Map<UUID, AdditionExercise> exercises =
            new ConcurrentHashMap<>();

    @Override
    public void save(UUID exerciseId, AdditionExercise exercise) {
        exercises.put(exerciseId, exercise);
    }

    @Override
    public Optional<AdditionExercise> findById(UUID exerciseId) {
        return Optional.ofNullable(exercises.get(exerciseId));
    }
}
