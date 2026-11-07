import { useState } from "react";

type NavbarProps = { onNavigate: (page: "home" | "addition") => void; };

export function Navbar({ onNavigate }: NavbarProps) {
    const [isMathMenuOpen, setIsMathMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <button onClick={() => onNavigate("home")}>
                Accueil
            </button>

            <div className="dropdown">
                <button
                    onClick={() => setIsMathMenuOpen(!isMathMenuOpen)}
                    aria-expanded={isMathMenuOpen}
                    aria-haspopup="true"
                >
                    Mathématiques
                </button>

                {isMathMenuOpen && (
                    <div className="dropdown-menu">
                        <button onClick={() => {
                            onNavigate("addition");
                            setIsMathMenuOpen(false);
                        }}>
                            Additions
                        </button>
                    </div>
                )}
            </div>

            <button disabled>
                Langues
            </button>
        </nav>
    );
}