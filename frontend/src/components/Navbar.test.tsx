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

test("givenMobileMenuClosed_whenClickingMenuButton_thenOpensNavigation", async () => {
    // Arrange
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(<Navbar onNavigate={onNavigate} />);

    // Act
    await user.click(screen.getByRole("button", { name: "Ouvrir le menu" }));

    // Assert
    expect(
        screen.getByRole("button", { name: "Fermer le menu" })
    ).toHaveAttribute("aria-expanded", "true");

    // Act
    await user.click(screen.getByRole("button", { name: "Fermer le menu" }));

    // Assert
    expect(
        screen.getByRole("button", { name: "Ouvrir le menu" })
    ).toHaveAttribute("aria-expanded", "false");
});

test("givenMobileMenuOpen_whenNavigatingToAdditions_thenClosesMenu", async () => {
    // Arrange
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(<Navbar onNavigate={onNavigate} />);

    // Act - Ouvrir le menu mobile
    await user.click(screen.getByRole("button", { name: "Ouvrir le menu" }));

    expect(
        screen.getByRole("button", { name: "Fermer le menu" })
    ).toHaveAttribute("aria-expanded", "true");

    // Act - Ouvrir le sous-menu Mathématiques
    await user.click(screen.getByRole("button", { name: "Mathématiques" }));

    expect(
        screen.getByRole("button", { name: "Mathématiques" })
    ).toHaveAttribute("aria-expanded", "true");

    // Act - Sélectionner Additions
    await user.click(screen.getByRole("button", { name: "Additions" }));

    // Assert - La navigation est effectuée
    expect(onNavigate).toHaveBeenCalledExactlyOnceWith("addition");

    // Assert - Le menu mobile est fermé
    expect(
        screen.getByRole("button", { name: "Ouvrir le menu" })
    ).toHaveAttribute("aria-expanded", "false");

    // Assert - Le sous-menu Mathématiques est réinitialisé
    expect(
        screen.getByRole("button", { name: "Mathématiques" })
    ).toHaveAttribute("aria-expanded", "false");

    expect(screen.queryByRole("button", { name: "Additions" })).not.toBeInTheDocument();
});