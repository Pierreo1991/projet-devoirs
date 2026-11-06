package com.pierreo.projet_devoir_po.application.addition;

import java.util.UUID;

public record CreatedAdditionExercise(
        UUID exerciseId,
        int firstOperand,
        int secondOperand) {
}
