
import { useState } from "react";

type Page = "home" | "addition";

type NavbarProps = {
    onNavigate: (page: Page) => void;
};

export function Navbar({ onNavigate }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMathMenuOpen, setIsMathMenuOpen] = useState(false);

    function handleNavigate(page: Page) {
        onNavigate(page);
        setIsMenuOpen(false);
        setIsMathMenuOpen(false);
    }

    function handleToggleMenu() {
        setIsMenuOpen((previous) => !previous);
        setIsMathMenuOpen(false);
    }

    return (
        <nav className="site-navbar" aria-label="Navigation principale">
            <div className="navbar-header">
                <span className="navbar-brand">
                    Mon espace
                </span>

                <button
                    type="button"
                    className="navbar-menu-toggle"
                    aria-label={
                        isMenuOpen
                            ? "Fermer le menu"
                            : "Ouvrir le menu"
                    }
                    aria-expanded={isMenuOpen}
                    aria-controls="navbar-navigation"
                    onClick={handleToggleMenu}
                >
                    <span aria-hidden="true">
                        {isMenuOpen ? "✕" : "☰"}
                    </span>
                </button>
            </div>

            <div
                id="navbar-navigation"
                className={`navbar-navigation ${isMenuOpen ? "navbar-navigation-open" : ""}`}
            >
                <button
                    type="button"
                    className="navbar-link"
                    onClick={() => handleNavigate("home")}
                >
                    Accueil
                </button>

                <div className="navbar-dropdown">
                    <button
                        type="button"
                        className="navbar-link navbar-dropdown-toggle"
                        aria-expanded={isMathMenuOpen}
                        onClick={() => setIsMathMenuOpen((previous) => !previous)}
                    >
                        Mathématiques
                    </button>

                    {isMathMenuOpen && (
                        <div className="navbar-dropdown-content">
                            <button
                                type="button"
                                className="navbar-link navbar-submenu-link"
                                onClick={() => handleNavigate("addition")}
                            >
                                Additions
                            </button>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="navbar-link"
                    disabled
                >
                    Langues
                </button>
            </div>
        </nav>
    );
}