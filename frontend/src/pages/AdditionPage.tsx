import { useState } from "react";
import type { SubmitEvent } from "react";
import type { AdditionExercise } from "../types/AdditionExercise";

type AdditionPageProps = {
    exercise: AdditionExercise;
    onSubmitAnswer?: (answer: number) => void;
    onAnswerChange?: () => void;
    onNewExercise?: () => void;
    isCorrect?: boolean | null;
    isChecking?: boolean;
};

export function AdditionPage({
                                 exercise,
                                 onSubmitAnswer,
                                 onAnswerChange,
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
            <section className="addition-card">
                <div className="addition-header">
                    <span className="addition-category">
                        Mathématiques · Additions
                    </span>

                    <h1>À toi de jouer!</h1>
                    <p>Combien font ces deux nombres?</p>
                </div>

                <div
                    className="addition-equation"
                    role="group"
                    aria-label={`${exercise.firstOperand} + ${exercise.secondOperand} = ?`}
                >
                    <span className="addition-number addition-number-first">
                        {exercise.firstOperand}
                    </span>

                    <span className="addition-operator">+</span>

                    <span className="addition-number addition-number-second">
                        {exercise.secondOperand}
                    </span>

                    <span className="addition-operator">= ?</span>
                </div>

                {isCorrect !== true && (
                    <form className="addition-form" onSubmit={handleSubmit}>
                        <label htmlFor="addition-answer">
                            Ta réponse
                        </label>

                        <input
                            id="addition-answer"
                            type="number"
                            step="1"
                            value={answer}
                            disabled={isChecking}
                            onChange={(event) => {
                                setAnswer(event.target.value);
                                onAnswerChange?.();
                            }}
                        />

                        <button
                            type="submit"
                            disabled={answer.trim() === "" || isChecking}
                        >
                            {isChecking ? "Vérification..." : "Vérifier"}
                        </button>
                    </form>
                )}

                {isCorrect === true && (
                    <div className="addition-feedback addition-feedback-success">
                        <div className="addition-feedback-message">
                            <span className="addition-feedback-icon" aria-hidden="true">
                                🎉
                            </span>

                            <div className="addition-feedback-text">
                                <p role="status">Bravo! Bonne réponse!</p>
                                <span>Tu as trouvé la bonne réponse!</span>
                            </div>
                        </div>

                        <button type="button" onClick={onNewExercise}>
                            Nouvelle addition
                        </button>
                    </div>
                )}

                {isCorrect === false && (
                    <div className="addition-feedback addition-feedback-error">
                        <div className="addition-feedback-message">
                            <span className="addition-feedback-icon" aria-hidden="true">
                                💡
                            </span>

                            <div className="addition-feedback-text">
                                <p role="status">Essaie encore!</p>
                                <span>Tu peux y arriver, prends ton temps!</span>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}