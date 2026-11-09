import { act, render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { AdditionExerciseContainer } from "./AdditionExerciseContainer";
import { createAdditionExercise } from "../services/additionApi";
import { checkAdditionAnswer } from "../services/additionApi";

vi.mock("../services/additionApi", () => ({
    createAdditionExercise: vi.fn(),
    checkAdditionAnswer: vi.fn(),
}));

async function findAddition(firstOperand: number, secondOperand: number) {
    return screen.findByRole("group", {
        name: `${firstOperand} + ${secondOperand} = ?`,
    });
}

test("givenGeneratedExercise_whenLoadingPage_thenDisplaysAddition", async () => {
    // Arrange
    const exercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};

    vi.mocked(createAdditionExercise)
        .mockResolvedValue(exercise);

    // Act
    render(<AdditionExerciseContainer />);

    // Assert
    expect(await findAddition(3, 8)).toBeInTheDocument();
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
    expect(await findAddition(3, 8)).toBeInTheDocument();

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

    expect(await findAddition(3, 8)).toBeInTheDocument();

    await user.type(screen.getByRole("spinbutton"), "11");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    expect(await screen.findByText("Bravo! Bonne réponse!")).toBeInTheDocument();

    // Act
    await user.click(screen.getByRole("button", { name: "Nouvelle addition" }));

    // Assert
    expect(await findAddition(6, 2)).toBeInTheDocument();
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
    expect(await findAddition(3, 8)).toBeInTheDocument();

    // Act - Première tentative incorrecte
    await user.type(screen.getByRole("spinbutton"), "10");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    // Assert - Peut réessayer
    expect(await screen.findByText("Essaie encore!")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "3 + 8 = ?" })).toBeInTheDocument();
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

    expect(await findAddition(3, 8)).toBeInTheDocument();

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

    expect(await findAddition(3, 8)).toBeInTheDocument();

    await user.type(screen.getByRole("spinbutton"), "11");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    expect(await screen.findByText("Bravo! Bonne réponse!")).toBeInTheDocument();

    // Act - Échec du chargement du nouvel exercice
    await user.click(screen.getByRole("button", { name: "Nouvelle addition" }));

    // Assert - L'ancien exercice reste accessible
    expect(await screen.findByRole("alert")).toHaveTextContent("Impossible de charger un nouvel exercice.");
    expect(screen.getByRole("group", { name: "3 + 8 = ?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nouvelle addition" })).toBeEnabled();

    // Act - Nouvelle tentative
    await user.click(screen.getByRole("button", { name: "Nouvelle addition" }));

    // Assert - Le nouvel exercice est affiché
    expect(await findAddition(6, 2)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText("Bravo! Bonne réponse!")).not.toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(null);
    expect(createAdditionExercise).toHaveBeenCalledTimes(3);
});

test("givenIncorrectAnswer_whenEditingAnswer_thenClearsFeedback", async () => {
    // Arrange
    const user = userEvent.setup();
    const exercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};

    vi.mocked(createAdditionExercise)
        .mockResolvedValue(exercise);
    vi.mocked(checkAdditionAnswer)
        .mockResolvedValue(false);

    render(<AdditionExerciseContainer />);

    expect(await screen.findByRole("group", { name: "3 + 8 = ?" })).toBeInTheDocument();

    // Act - Première tentative incorrecte
    await user.type(screen.getByRole("spinbutton"), "10");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    // Assert - Rétroaction affichée
    expect(await screen.findByText("Essaie encore!")).toBeInTheDocument();

    // Act - L'enfant commence à corriger sa réponse
    await user.clear(screen.getByRole("spinbutton"));

    // Assert - La rétroaction disparaît
    expect(screen.queryByText("Essaie encore!")).not.toBeInTheDocument();

    // L'exercice n'a pas changé
    expect(screen.getByRole("group", { name: "3 + 8 = ?" })).toBeInTheDocument();
    expect(createAdditionExercise).toHaveBeenCalledTimes(1);
});

test("givenDefaultDifficulty_whenLoadingPage_thenRequestsEasyExercise", async () => {
    // Arrange
    const exercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};

    vi.mocked(createAdditionExercise).mockResolvedValue(exercise);

    // Act
    render(<AdditionExerciseContainer />);

    // Assert
    expect(await findAddition(3, 8)).toBeInTheDocument();
    expect(createAdditionExercise).toHaveBeenCalledExactlyOnceWith("EASY");
});

test("givenEasyExercise_whenSelectingMediumDifficulty_thenLoadsMediumExercise", async () => {
    // Arrange
    const user = userEvent.setup();
    const easyExercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};
    const mediumExercise = {exerciseId: "456", firstOperand: 25, secondOperand: 68,};

    vi.mocked(createAdditionExercise)
        .mockResolvedValueOnce(easyExercise)
        .mockResolvedValueOnce(mediumExercise);

    render(<AdditionExerciseContainer />);

    expect(await findAddition(3, 8)).toBeInTheDocument();

    // Act
    await user.click(screen.getByRole("button", { name: "100" }));

    // Assert
    expect(await findAddition(25, 68)).toBeInTheDocument();
    expect(createAdditionExercise).toHaveBeenNthCalledWith(1, "EASY");
    expect(createAdditionExercise).toHaveBeenNthCalledWith(2, "MEDIUM");
    expect(screen.getByRole("button", { name: "100" })).toHaveAttribute("aria-pressed", "true");
});

test("givenMediumDifficulty_whenRequestingNewExercise_thenKeepsMediumDifficulty", async () => {
    // Arrange
    const user = userEvent.setup();
    const easyExercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};
    const firstMediumExercise = {exerciseId: "456", firstOperand: 25, secondOperand: 68,};
    const secondMediumExercise = {exerciseId: "789", firstOperand: 40, secondOperand: 50,};

    vi.mocked(createAdditionExercise)
        .mockResolvedValueOnce(easyExercise)
        .mockResolvedValueOnce(firstMediumExercise)
        .mockResolvedValueOnce(secondMediumExercise);

    vi.mocked(checkAdditionAnswer).mockResolvedValue(true);

    render(<AdditionExerciseContainer />);

    expect(await findAddition(3, 8)).toBeInTheDocument();

    // Act - Sélectionner MEDIUM
    await user.click(screen.getByRole("button", { name: "100" }));
    expect(await findAddition(25, 68)).toBeInTheDocument();

    // Act - Répondre correctement
    await user.type(screen.getByRole("spinbutton"), "93");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    expect(await screen.findByText("Bravo! Bonne réponse!")).toBeInTheDocument();

    // Act - Demander une nouvelle addition
    await user.click(screen.getByRole("button", { name: "Nouvelle addition" }));

    // Assert
    expect(await findAddition(40, 50)).toBeInTheDocument();

    expect(createAdditionExercise).toHaveBeenNthCalledWith(1, "EASY");
    expect(createAdditionExercise).toHaveBeenNthCalledWith(2, "MEDIUM");
    expect(createAdditionExercise).toHaveBeenNthCalledWith(3, "MEDIUM");

    expect(screen.getByRole("button", { name: "100" })).toHaveAttribute("aria-pressed", "true");
});

test("givenIncorrectAnswer_whenChangingDifficulty_thenResetsAnswerAndFeedback", async () => {
    // Arrange
    const user = userEvent.setup();
    const easyExercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};
    const mediumExercise = {exerciseId: "456", firstOperand: 25, secondOperand: 68,};

    vi.mocked(createAdditionExercise)
        .mockResolvedValueOnce(easyExercise)
        .mockResolvedValueOnce(mediumExercise);

    vi.mocked(checkAdditionAnswer).mockResolvedValue(false);

    render(<AdditionExerciseContainer />);

    expect(await findAddition(3, 8)).toBeInTheDocument();

    // Act - Soumettre une mauvaise réponse
    await user.type(screen.getByRole("spinbutton"), "10");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    expect(await screen.findByText("Essaie encore!")).toBeInTheDocument();

    // Act - Changer de difficulté
    await user.click(screen.getByRole("button", { name: "100" }));

    // Assert
    expect(await findAddition(25, 68)).toBeInTheDocument();
    expect(screen.queryByText("Essaie encore!")).not.toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(null);
    expect(createAdditionExercise).toHaveBeenNthCalledWith(2, "MEDIUM");
});

test("givenPendingMediumRequest_whenHardResponseArrivesFirst_thenKeepsHardExercise", async () => {
    // Arrange
    const user = userEvent.setup();
    const easyExercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};
    const mediumExercise = {exerciseId: "456", firstOperand: 25, secondOperand: 68,};
    const hardExercise = {exerciseId: "789", firstOperand: 425, secondOperand: 368,};

    let resolveMedium!: (exercise: typeof mediumExercise) => void;
    let resolveHard!: (exercise: typeof hardExercise) => void;

    const mediumPromise = new Promise<typeof mediumExercise>((resolve) => {
        resolveMedium = resolve;
    });

    const hardPromise = new Promise<typeof hardExercise>((resolve) => {
        resolveHard = resolve;
    });

    vi.mocked(createAdditionExercise)
        .mockResolvedValueOnce(easyExercise)
        .mockReturnValueOnce(mediumPromise)
        .mockReturnValueOnce(hardPromise);

    render(<AdditionExerciseContainer />);

    expect(await findAddition(3, 8)).toBeInTheDocument();

    // Act - Sélectionner MEDIUM, sans résoudre la requête
    await user.click(screen.getByRole("button", { name: "100" }));

    await waitFor(() => {
        expect(createAdditionExercise).toHaveBeenNthCalledWith(2, "MEDIUM");
    });

    // Act - Sélectionner HARD pendant le chargement de MEDIUM
    await user.click(screen.getByRole("button", { name: "1000" }));

    await waitFor(() => {
        expect(createAdditionExercise).toHaveBeenNthCalledWith(3, "HARD");
    });

    // Act - La réponse HARD arrive en premier
    resolveHard(hardExercise);

    expect(await findAddition(425, 368)).toBeInTheDocument();

    // Act - L'ancienne réponse MEDIUM arrive ensuite
    resolveMedium(mediumExercise);

    // Assert
    await waitFor(() => {
        expect(screen.getByRole("group", {name: "425 + 368 = ?",})).toBeInTheDocument();

        expect(screen.queryByRole("group", {name: "25 + 68 = ?",})).not.toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "1000" })).toHaveAttribute("aria-pressed", "true");
});

test("givenPendingNewExercise_whenChangingDifficulty_thenIgnoresOldResponse", async () => {
    // Arrange
    const user = userEvent.setup();
    const easyExercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};
    const outdatedEasyExercise = {exerciseId: "456", firstOperand: 6, secondOperand: 2,};
    const mediumExercise = {exerciseId: "789", firstOperand: 25, secondOperand: 68,};

    let resolveOldRequest!: (exercise: typeof outdatedEasyExercise) => void;

    const oldRequest = new Promise<typeof outdatedEasyExercise>((resolve) => {
        resolveOldRequest = resolve;
    });

    vi.mocked(createAdditionExercise)
        .mockResolvedValueOnce(easyExercise)
        .mockReturnValueOnce(oldRequest)
        .mockResolvedValueOnce(mediumExercise);

    vi.mocked(checkAdditionAnswer).mockResolvedValue(true);

    render(<AdditionExerciseContainer />);

    expect(await findAddition(3, 8)).toBeInTheDocument();

    // Répondre correctement
    await user.type(screen.getByRole("spinbutton"), "11");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    expect(await screen.findByText("Bravo! Bonne réponse!")).toBeInTheDocument();

    // Lancer une nouvelle addition EASY
    await user.click(screen.getByRole("button", { name: "Nouvelle addition" }));

    await waitFor(() => {
        expect(createAdditionExercise).toHaveBeenCalledTimes(2);
    });

    // Changer vers MEDIUM pendant la requête EASY
    await user.click(screen.getByRole("button", { name: "100" }));

    expect(await findAddition(25, 68)).toBeInTheDocument();

    // Act - L'ancienne requête EASY se termine après MEDIUM
    await act(async () => {
        resolveOldRequest(outdatedEasyExercise);
    });

    // Assert - L'exercice MEDIUM doit rester affiché
    expect(screen.getByRole("group", {name: "25 + 68 = ?",})).toBeInTheDocument();
    expect(screen.queryByRole("group", {name: "6 + 2 = ?",})).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "100" })).toHaveAttribute("aria-pressed", "true");
    expect(createAdditionExercise).toHaveBeenNthCalledWith(3, "MEDIUM");
});