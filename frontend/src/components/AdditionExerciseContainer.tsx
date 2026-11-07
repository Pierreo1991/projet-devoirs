import { useEffect, useState } from "react";
import { AdditionPage } from "../pages/AdditionPage";
import {
    createAdditionExercise,
    checkAdditionAnswer,
} from "../services/additionApi";
import type { AdditionExercise } from "../types/AdditionExercise";

export function AdditionExerciseContainer() {
    const [exercise, setExercise] = useState<AdditionExercise | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadExercise() {
            try {
                const generatedExercise = await createAdditionExercise();

                if (active) {
                    setExercise(generatedExercise);
                }
            } catch {
                if (active) {
                    setError("Impossible de charger l'exercice.");
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        }

        void loadExercise();

        return () => {active = false;};
    }, []);

    async function handleSubmitAnswer(answer: number) {
        if (!exercise || isChecking || isCorrect === true || isLoading) {
            return;
        }

        setIsChecking(true);
        setError(null);

        try {
            const result = await checkAdditionAnswer(exercise.exerciseId, answer);

            setIsCorrect(result);
        } catch {
            setError("Impossible de vérifier la réponse.");
        } finally {
            setIsChecking(false);
        }
    }

    async function handleNewExercise() {
        if (isLoading || isChecking) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const generatedExercise = await createAdditionExercise();

            setExercise(generatedExercise);
            setIsCorrect(null);
        } catch {
            setError("Impossible de charger un nouvel exercice.");
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <p>Chargement de l'exercice...</p>;
    }

    if (!exercise) {
        return <p role="alert">{error ?? "Aucun exercice disponible."}</p>;
    }

    return (
        <>
            <AdditionPage
                key={exercise.exerciseId}
                exercise={exercise}
                onSubmitAnswer={handleSubmitAnswer}
                onNewExercise={handleNewExercise}
                isCorrect={isCorrect}
                isChecking={isChecking}
            />

            {error && <p role="alert">{error}</p>}
        </>
    );
}