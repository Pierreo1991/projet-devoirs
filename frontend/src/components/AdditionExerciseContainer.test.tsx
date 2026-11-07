import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { AdditionExerciseContainer } from "./AdditionExerciseContainer";
import { createAdditionExercise } from "../services/additionApi";
import { checkAdditionAnswer } from "../services/additionApi";

vi.mock("../services/additionApi", () => ({
    createAdditionExercise: vi.fn(),
    checkAdditionAnswer: vi.fn(),
}));

test("givenGeneratedExercise_whenLoadingPage_thenDisplaysAddition", async () => {
    // Arrange
    const exercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};

    vi.mocked(createAdditionExercise)
        .mockResolvedValue(exercise);

    // Act
    render(<AdditionExerciseContainer />);

    // Assert
    expect(await screen.findByText("3 + 8 = ?")).toBeInTheDocument();
});

test("givenCorrectAnswer_whenSubmitting_thenDisplaysSuccessFeedback", async () => {
    // Arrange
    const user = userEvent.setup();
    const exercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};

    vi.mocked(createAdditionExercise)
        .mockResolvedValue(exercise);
    vi.mocked(checkAdditionAnswer)
        .mockResolvedValue(true);

    render(<AdditionExerciseContainer />);

    // Wait for exercise loading
    expect(await screen.findByText("3 + 8 = ?")).toBeInTheDocument();

    // Act
    await user.type(screen.getByRole("spinbutton"), "11");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    // Assert
    expect(await screen.findByText("Bravo! Bonne réponse!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nouvelle addition" })).toBeInTheDocument();
    expect(checkAdditionAnswer).toHaveBeenCalledExactlyOnceWith("123", 11);
});

test("givenCorrectAnswer_whenRequestingNewExercise_thenDisplaysNewAddition", async () => {
    // Arrange
    const user = userEvent.setup();
    const firstExercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};
    const secondExercise = {exerciseId: "456", firstOperand: 6, secondOperand: 2,};

    vi.mocked(createAdditionExercise)
        .mockResolvedValueOnce(firstExercise)
        .mockResolvedValueOnce(secondExercise);
    vi.mocked(checkAdditionAnswer)
        .mockResolvedValue(true);

    render(<AdditionExerciseContainer />);

    expect(await screen.findByText("3 + 8 = ?")).toBeInTheDocument();

    await user.type(screen.getByRole("spinbutton"), "11");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    expect(await screen.findByText("Bravo! Bonne réponse!")).toBeInTheDocument();

    // Act
    await user.click(screen.getByRole("button", { name: "Nouvelle addition" }));

    // Assert
    expect(await screen.findByText("6 + 2 = ?")).toBeInTheDocument();
    expect(createAdditionExercise).toHaveBeenCalledTimes(2);
    expect(screen.queryByText("Bravo! Bonne réponse!")).not.toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(null);
});

test("givenIncorrectAnswer_whenRetryingWithCorrectAnswer_thenDisplaysSuccess", async () => {
    // Arrange
    const user = userEvent.setup();
    const exercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};

    vi.mocked(createAdditionExercise)
        .mockResolvedValue(exercise);
    vi.mocked(checkAdditionAnswer)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

    render(<AdditionExerciseContainer />);
    expect(await screen.findByText("3 + 8 = ?")).toBeInTheDocument();

    // Act - Première tentative incorrecte
    await user.type(screen.getByRole("spinbutton"), "10");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    // Assert - Peut réessayer
    expect(await screen.findByText("Essaie encore!")).toBeInTheDocument();
    expect(screen.getByText("3 + 8 = ?")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toBeEnabled();

    // Act - Deuxième tentative correcte
    await user.clear(screen.getByRole("spinbutton"));
    await user.type(screen.getByRole("spinbutton"), "11");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    // Assert
    expect(await screen.findByText("Bravo! Bonne réponse!")).toBeInTheDocument();
    expect(screen.queryByText("Essaie encore!")).not.toBeInTheDocument();
    expect(checkAdditionAnswer).toHaveBeenNthCalledWith(1, "123", 10);
    expect(checkAdditionAnswer).toHaveBeenNthCalledWith(2, "123", 11);
    expect(createAdditionExercise).toHaveBeenCalledTimes(1);
});

test("givenVerificationError_whenRetrying_thenCanSubmitAnswerAgain", async () => {
    // Arrange
    const user = userEvent.setup();
    const exercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};

    vi.mocked(createAdditionExercise)
        .mockResolvedValue(exercise);
    vi.mocked(checkAdditionAnswer)
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce(true);

    render(<AdditionExerciseContainer />);

    expect(await screen.findByText("3 + 8 = ?")).toBeInTheDocument();

    // Act - Première tentative : erreur technique
    await user.type(screen.getByRole("spinbutton"), "11");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    // Assert - L'erreur est affichée
    expect(await screen.findByRole("alert")).toHaveTextContent("Impossible de vérifier la réponse.");

    expect(screen.getByRole("spinbutton")).toHaveValue(11);
    expect(screen.getByRole("spinbutton")).toBeEnabled();

    // Act - Nouvelle tentative
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    // Assert - La vérification réussit
    expect(await screen.findByText("Bravo! Bonne réponse!")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(checkAdditionAnswer).toHaveBeenCalledTimes(2);
    expect(checkAdditionAnswer).toHaveBeenNthCalledWith(1, "123", 11);
    expect(checkAdditionAnswer).toHaveBeenNthCalledWith(2, "123", 11);
});

test("givenNewExerciseLoadingError_whenRetrying_thenDisplaysNewAddition", async () => {
    // Arrange
    const user = userEvent.setup();
    const firstExercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};
    const secondExercise = {exerciseId: "456", firstOperand: 6, secondOperand: 2,};

    vi.mocked(createAdditionExercise)
        .mockResolvedValueOnce(firstExercise)
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce(secondExercise);
    vi.mocked(checkAdditionAnswer)
        .mockResolvedValue(true);

    render(<AdditionExerciseContainer />);

    expect(await screen.findByText("3 + 8 = ?")).toBeInTheDocument();

    await user.type(screen.getByRole("spinbutton"), "11");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    expect(await screen.findByText("Bravo! Bonne réponse!")).toBeInTheDocument();

    // Act - Échec du chargement du nouvel exercice
    await user.click(screen.getByRole("button", { name: "Nouvelle addition" }));

    // Assert - L'ancien exercice reste accessible
    expect(await screen.findByRole("alert")).toHaveTextContent("Impossible de charger un nouvel exercice.");
    expect(screen.getByText("3 + 8 = ?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nouvelle addition" })).toBeEnabled();

    // Act - Nouvelle tentative
    await user.click(screen.getByRole("button", { name: "Nouvelle addition" }));

    // Assert - Le nouvel exercice est affiché
    expect(await screen.findByText("6 + 2 = ?")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText("Bravo! Bonne réponse!")).not.toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(null);
    expect(createAdditionExercise).toHaveBeenCalledTimes(3);
});