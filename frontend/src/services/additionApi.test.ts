import { afterEach, expect, test, vi } from "vitest";
import { checkAdditionAnswer } from "./additionApi";
import { createAdditionExercise } from "./additionApi";

afterEach(() => {
    vi.unstubAllGlobals();
});

test("givenSuccessfulApiResponse_whenCreatingExercise_thenReturnsExercise", async () => {
    // Arrange
    const exercise = {
        exerciseId: "123",
        firstOperand: 3,
        secondOperand: 8,
    };

    const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => exercise,
    });

    vi.stubGlobal("fetch", fetchMock);

    // Act
    const result = await createAdditionExercise();

    // Assert
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/additions", { method: "POST" });

    expect(result).toEqual(exercise);
});

test("givenFailedApiResponse_whenCreatingExercise_thenThrowsError", async () => {
    // Arrange
    const fetchMock = vi.fn().mockResolvedValue({ok: false, status: 500,});

    vi.stubGlobal("fetch", fetchMock);

    // Act & Assert
    await expect(createAdditionExercise()).rejects.toThrow("Failed to create addition exercise");

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/additions", { method: "POST" });
});

test("givenCorrectAnswer_whenCheckingAnswer_thenReturnsTrue", async () => {
    // Arrange
    const exerciseId = "123";
    const answer = 11;

    const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ correct: true }),
    });

    vi.stubGlobal("fetch", fetchMock);

    // Act
    const result = await checkAdditionAnswer(exerciseId, answer);

    // Assert
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
        `/api/additions/${exerciseId}/answer`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ answer }),
        }
    );

    expect(result).toBe(true);
});

test("givenIncorrectAnswer_whenCheckingAnswer_thenReturnsFalse", async () => {
    // Arrange
    const exerciseId = "123";
    const answer = 10;

    const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ correct: false }),
    });

    vi.stubGlobal("fetch", fetchMock);

    // Act
    const result = await checkAdditionAnswer(exerciseId, answer);

    // Assert
    expect(result).toBe(false);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
        `/api/additions/${exerciseId}/answer`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ answer }),
        }
    );
});

test("givenFailedApiResponse_whenCheckingAnswer_thenThrowsError", async () => {
    // Arrange
    const exerciseId = "123";
    const answer = 11;

    const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
    });

    vi.stubGlobal("fetch", fetchMock);

    // Act & Assert
    await expect(checkAdditionAnswer(exerciseId, answer))
        .rejects.toThrow("Failed to check addition answer");

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
        `/api/additions/${exerciseId}/answer`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ answer }),
        }
    );
});

test("givenMediumDifficulty_whenCreatingExercise_thenSendsDifficultyToApi", async () => {
    // Arrange
    const exercise = {exerciseId: "123", firstOperand: 25, secondOperand: 100,};

    const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => exercise,
    });

    vi.stubGlobal("fetch", fetchMock);

    // Act
    const result = await createAdditionExercise("MEDIUM");

    // Assert
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/additions?difficulty=MEDIUM", { method: "POST" });

    expect(result).toEqual(exercise);
});