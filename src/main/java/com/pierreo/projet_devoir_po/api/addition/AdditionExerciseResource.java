package com.pierreo.projet_devoir_po.api.addition;

import com.pierreo.projet_devoir_po.application.addition.AdditionExerciseService;
import com.pierreo.projet_devoir_po.application.addition.CreatedAdditionExercise;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/additions")
@RequiredArgsConstructor
public class AdditionExerciseResource {

    private final AdditionExerciseService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreatedAdditionExercise createExercise() {
        return service.createExercise();
    }

    @PostMapping("/{exerciseId}/answer")
    public CheckAdditionAnswerResponse checkAnswer(
            @PathVariable UUID exerciseId,
            @RequestBody CheckAdditionAnswerRequest request) {

        boolean correct = service.checkAnswer(exerciseId, request.answer());

        return new CheckAdditionAnswerResponse(correct);
    }
}
