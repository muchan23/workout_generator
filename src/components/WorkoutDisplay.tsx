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
            <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-lg text-gray-600">ワークアウトメニューを生成中...</span>
                </div>
            </div>
        );
    }

    if (!workout) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto text-center">
                <div className="text-gray-500 text-lg">
                    設定を完了して「メニュー生成」ボタンを押してください
                </div>
            </div>
        );
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-800 border-green-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'hard': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return '初級';
            case 'medium': return '中級';
            case 'hard': return '上級';
            default: return '不明';
        }
    };
}