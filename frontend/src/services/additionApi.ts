import type { AdditionExercise } from "../types/AdditionExercise";

export async function createAdditionExercise(): Promise<AdditionExercise> {
    const response = await fetch("/api/additions", {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Failed to create addition exercise");
    }

    return response.json() as Promise<AdditionExercise>;
}

export async function checkAdditionAnswer(
    exerciseId: string,
    answer: number
): Promise<boolean> {
    const response = await fetch(`/api/additions/${exerciseId}/answer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer }),
    });

    if (!response.ok) {
        throw new Error("Failed to check addition answer");
    }

    const result: { correct: boolean } = await response.json();

    return result.correct;
}