import { useState } from "react";
import type { SubmitEvent } from "react";
import type { AdditionExercise } from "../types/AdditionExercise";

type AdditionPageProps = {
    exercise: AdditionExercise;
    onSubmitAnswer?: (answer: number) => void;
    onNewExercise?: () => void;
    isCorrect?: boolean | null;
    isChecking?: boolean;
};

export function AdditionPage({
                                 exercise,
                                 onSubmitAnswer,
                                 onNewExercise,
                                 isCorrect = null,
                                 isChecking = false,
                             }: AdditionPageProps) {
    const [answer, setAnswer] = useState("");

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (answer.trim() === "" || isChecking || isCorrect === true) {
            return;
        }

        onSubmitAnswer?.(Number(answer));
    }

    return (
        <main className="addition-page">
            <h1>Les additions</h1>
            <p>Trouve la bonne réponse!</p>

            <h2>
                {exercise.firstOperand} + {exercise.secondOperand} = ?
            </h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="addition-answer">
                    Ta réponse
                </label>

                <input
                    id="addition-answer"
                    type="number"
                    step="1"
                    value={answer}
                    disabled={isChecking || isCorrect === true}
                    onChange={(event) => setAnswer(event.target.value)}
                />

                <button
                    type="submit"
                    disabled={
                        answer.trim() === "" ||
                        isChecking ||
                        isCorrect === true
                    }
                >
                    {isChecking ? "Vérification..." : "Vérifier"}
                </button>
            </form>

            {isCorrect === true && (
                <div>
                    <p role="status">Bravo! Bonne réponse!</p>
                    <button
                        type="button"
                        onClick={onNewExercise}
                    >
                        Nouvelle addition
                    </button>
                </div>
            )}

            {isCorrect === false && (
                <p role="status">Essaie encore!</p>
            )}
        </main>
    );
}