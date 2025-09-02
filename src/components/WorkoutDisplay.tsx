import React from "react";
import { WorkoutMenu, Exercise } from "../lib/types";

interface WorkoutDisplayProps {
    workout: WorkoutMenu | null;
    isLoading: boolean;
    onStartWorkout: (workout: WorkoutMenu) => void;
    onSaveWorkout: (workout: WorkoutMenu) => void;
}

export default function WorkoutDisplay({
    workout,
    isLoading,
    onStartWorkout,
    onSaveWorkout
}: WorkoutDisplayProps) {
    if (isLoading) {
        return (
            <div>
                <div>
                    <div></div>
                    <span></span>
                </div>
            </div>
        )
    }
}