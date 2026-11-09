import { useEffect, useRef, useState } from "react";
import { AdditionPage } from "../pages/AdditionPage";
import {
    createAdditionExercise,
    checkAdditionAnswer,
} from "../services/additionApi";
import type { AdditionExercise } from "../types/AdditionExercise";
import type { AdditionDifficulty } from "../types/AdditionDifficulty";

export function AdditionExerciseContainer() {
    const [exercise, setExercise] = useState<AdditionExercise | null>(null);
    const [difficulty, setDifficulty] = useState<AdditionDifficulty>("EASY");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const requestIdRef = useRef(0);

    useEffect(() => {
        let active = true;
        const requestId = ++requestIdRef.current;

        async function loadExercise() {
            try {
                const generatedExercise = await createAdditionExercise(difficulty);

                if (active && requestId === requestIdRef.current) {
                    setExercise(generatedExercise);
                }
            } catch {
                if (active && requestId === requestIdRef.current) {
                    setError("Impossible de charger l'exercice.");
                }
            } finally {
                if (active && requestId === requestIdRef.current) {
                    setIsLoading(false);
                }
            }
        }

        void loadExercise();

        return () => {active = false;};
    }, [difficulty]);

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

    function handleAnswerChange() {
        setIsCorrect(null);
    }

    async function handleNewExercise() {
        if (isLoading || isChecking) {
            return;
        }

        const requestId = ++requestIdRef.current;

        setIsLoading(true);
        setError(null);

        try {
            const generatedExercise = await createAdditionExercise(difficulty);

            if (requestId === requestIdRef.current) {
                setExercise(generatedExercise);
                setIsCorrect(null);
            }
        } catch {
            if (requestId === requestIdRef.current) {
                setError("Impossible de charger un nouvel exercice.");
            }
        } finally {
            if (requestId === requestIdRef.current) {
                setIsLoading(false);
            }
        }
    }

    function handleDifficultyChange(newDifficulty: AdditionDifficulty) {
        if (newDifficulty === difficulty || isChecking) {
            return;
        }

        ++requestIdRef.current;

        setIsLoading(true);
        setError(null);
        setIsCorrect(null);
        setDifficulty(newDifficulty);
    }

    if (!exercise) {
        if (isLoading) {
            return <p>Chargement de l'exercice...</p>;
        }

        return <p role="alert">{error ?? "Aucun exercice disponible."}</p>;
    }

    return (
        <>
            <AdditionPage
                key={exercise.exerciseId}
                exercise={exercise}
                difficulty={difficulty}
                onDifficultyChange={handleDifficultyChange}
                onSubmitAnswer={handleSubmitAnswer}
                onAnswerChange={handleAnswerChange}
                onNewExercise={handleNewExercise}
                isCorrect={isCorrect}
                isChecking={isChecking}
                isLoading={isLoading}
            />

            {error && <p role="alert">{error}</p>}
        </>
    );
}