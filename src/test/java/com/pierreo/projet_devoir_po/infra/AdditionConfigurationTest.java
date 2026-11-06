package com.pierreo.projet_devoir_po.infra;

import com.pierreo.projet_devoir_po.application.addition.AdditionExerciseService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class AdditionConfigurationTest {

    @Autowired
    private AdditionExerciseService service;

    @Test
    void givenSpringContext_whenLoading_thenAdditionServiceIsAvailable() {
        assertNotNull(service);
    }
}
