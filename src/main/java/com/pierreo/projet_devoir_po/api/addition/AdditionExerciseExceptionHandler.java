package com.pierreo.projet_devoir_po.api.addition;

import com.pierreo.projet_devoir_po.application.addition.exception.AdditionExerciseNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AdditionExerciseExceptionHandler {

    @ExceptionHandler(AdditionExerciseNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public void handleAdditionExerciseNotFound(
            AdditionExerciseNotFoundException exception) {
    }
}