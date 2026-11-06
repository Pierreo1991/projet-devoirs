package com.pierreo.projet_devoir_po.integration;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AdditionExerciseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper jsonMapper;

    @Test
    void givenNewExercise_whenSubmittingCorrectAnswer_thenReturnsTrue()
            throws Exception {

        // Arrange & Act - Create an exercise
        MvcResult creationResult = mockMvc.perform(post("/api/additions"))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode createdExercise = jsonMapper.readTree(
                creationResult.getResponse().getContentAsString()
        );

        UUID exerciseId = UUID.fromString(
                createdExercise.get("exerciseId").asText()
        );

        int firstOperand = createdExercise.get("firstOperand").asInt();
        int secondOperand = createdExercise.get("secondOperand").asInt();

        // Assert - Verify the generated exercise
        assertTrue(firstOperand >= 1 && firstOperand <= 10);
        assertTrue(secondOperand >= 1 && secondOperand <= 10);

        // Arrange - Calculate the correct answer
        int correctAnswer = firstOperand + secondOperand;

        String requestBody = """
                {
                    "answer": %d
                }
                """.formatted(correctAnswer);

        // Act & Assert - Submit the answer
        mockMvc.perform(post("/api/additions/{exerciseId}/answer", exerciseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correct").value(true));
    }
}
