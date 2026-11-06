package com.pierreo.projet_devoir_po.application.addition.exception;

import java.util.UUID;

public class AdditionExerciseNotFoundException extends RuntimeException {

    public AdditionExerciseNotFoundException(UUID exerciseId) {
        super("Addition exercise not found: " + exerciseId);
    }
}
