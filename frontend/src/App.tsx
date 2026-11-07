import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { AdditionExerciseContainer } from "./components/AdditionExerciseContainer";
import "./App.css";

type Page = "home" | "addition";

function App() {
    const [currentPage, setCurrentPage] = useState<Page>("home");

    return (
        <>
            <Navbar onNavigate={setCurrentPage} />

            {currentPage === "home" && <HomePage />}

            {currentPage === "addition" && <AdditionExerciseContainer />}
        </>
    );
}

export default App;
