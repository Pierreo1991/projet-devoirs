package com.pierreo.projet_devoir_po.api.addition;

import com.pierreo.projet_devoir_po.application.addition.AdditionExerciseService;
import com.pierreo.projet_devoir_po.application.addition.CreatedAdditionExercise;
import com.pierreo.projet_devoir_po.application.addition.exception.AdditionExerciseNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdditionExerciseResource.class)
class AdditionExerciseResourceTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdditionExerciseService service;

    @Test
    void givenGeneratedExercise_whenCreatingExercise_thenReturnsCreatedExercise()
            throws Exception {
        // Arrange
        UUID exerciseId = UUID.randomUUID();

        CreatedAdditionExercise exercise = new CreatedAdditionExercise(exerciseId, 3, 8);

        when(service.createExercise()).thenReturn(exercise);

        // Act & Assert
        mockMvc.perform(post("/api/additions"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.exerciseId").value(exerciseId.toString()))
                .andExpect(jsonPath("$.firstOperand").value(3))
                .andExpect(jsonPath("$.secondOperand").value(8));
    }

    @Test
    void givenExistingExercise_whenSubmittingCorrectAnswer_thenReturnsTrue()
            throws Exception {
        // Arrange
        UUID exerciseId = UUID.randomUUID();

        when(service.checkAnswer(exerciseId, 11)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(post("/api/additions/{exerciseId}/answer", exerciseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "answer": 11
                            }
                            """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correct").value(true));

        verify(service).checkAnswer(exerciseId, 11);
    }

    @Test
    void givenExistingExercise_whenSubmittingIncorrectAnswer_thenReturnsFalse()
            throws Exception {
        // Arrange
        UUID exerciseId = UUID.randomUUID();

        when(service.checkAnswer(exerciseId, 10)).thenReturn(false);

        // Act & Assert
        mockMvc.perform(post("/api/additions/{exerciseId}/answer", exerciseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "answer": 10
                            }
                            """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correct").value(false));

        verify(service).checkAnswer(exerciseId, 10);
    }

    @Test
    void givenNonExistingExercise_whenSubmittingAnswer_thenReturnsNotFound()
            throws Exception {
        // Arrange
        UUID exerciseId = UUID.randomUUID();

        when(service.checkAnswer(exerciseId, 11)).thenThrow(new AdditionExerciseNotFoundException(exerciseId));

        // Act & Assert
        mockMvc.perform(post("/api/additions/{exerciseId}/answer", exerciseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "answer": 11
                            }
                            """))
                .andExpect(status().isNotFound());

        verify(service).checkAnswer(exerciseId, 11);
    }
}
