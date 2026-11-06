package com.pierreo.projet_devoir_po.domain.addition;

import java.util.Optional;
import java.util.UUID;

public interface AdditionExerciseRepository {

    void save(UUID exerciseId ,AdditionExercise additionExercise);

    Optional<AdditionExercise> findById(UUID exerciseId);
}
