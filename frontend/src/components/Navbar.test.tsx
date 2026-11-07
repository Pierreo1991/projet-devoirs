import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Navbar } from "./Navbar";

test("givenMathMenuClosed_whenClickingMath_thenDisplaysAdditionOption", async () => {
    // Arrange
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(<Navbar onNavigate={onNavigate} />);

    // Act
    await user.click(screen.getByRole("button", { name: "Mathématiques" }));

    // Assert
    expect(screen.getByRole("button", { name: "Additions" })).toBeInTheDocument();
});

test("givenMathMenuOpen_whenSelectingAddition_thenNavigatesAndClosesMenu", async () => {
    // Arrange
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(<Navbar onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: "Mathématiques" }));

    // Act
    await user.click(screen.getByRole("button", { name: "Additions" }));

    // Assert
    expect(onNavigate).toHaveBeenCalledExactlyOnceWith("addition");

    expect(screen.queryByRole("button", { name: "Additions" })).not.toBeInTheDocument();
});