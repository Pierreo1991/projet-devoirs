import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, vi, test } from "vitest";
import { AdditionPage } from "./AdditionPage";

test("givenAdditionExercise_whenRenderingPage_thenDisplaysOperands", () => {
    // Arrange
    const exercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};

    // Act
    render(<AdditionPage exercise={exercise} />);

    // Assert
    expect(screen.getByText("3 + 8 = ?")).toBeInTheDocument();
});

test("givenAdditionExercise_whenSubmittingAnswer_thenCallsHandler", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmitAnswer = vi.fn();

    const exercise = {exerciseId: "123", firstOperand: 3, secondOperand: 8,};

    render(<AdditionPage exercise={exercise} onSubmitAnswer={onSubmitAnswer}/>);

    // Act
    await user.type(screen.getByRole("spinbutton"), "11");

    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    // Assert
    expect(onSubmitAnswer).toHaveBeenCalledExactlyOnceWith(11);
});