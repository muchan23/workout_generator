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

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            {/* ヘッダー */}
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{workout.name}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        対象部位: {workout.targetMuscles}
                    </span>
                    <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        レベル: {workout.level === 'beginner' ? '初心者' : workout.level === 'intermediate' ? '中級者' : '上級者'}
                    </span>
                    <span className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        予想時間: {workout.duration}分
                    </span>
                    <span className="flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        器具: {workout.equipment.join(', ')}
                    </span>
                </div>
            </div>

            {/* エクササイズ一覧 */}
            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">エクササイズ一覧</h3>
                {workout.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </span>
                                <h4 className="text-lg font-semibold text-gray-800">{exercise.name}</h4>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(exercise.difficulty)}`}>
                                {getDifficultyLabel(exercise.difficulty)}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm text-gray-600 mb-1">セット数</div>
                                <div className="text-lg font-semibold text-gray-800">{exercise.sets}セット</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm text-gray-600 mb-1">回数</div>
                                <div className="text-lg font-semibold text-gray-800">{exercise.reps}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm text-gray-600 mb-1">休憩時間</div>
                                <div className="text-lg font-semibold text-gray-800">{exercise.restTime}秒</div>
                            </div>
                        </div>

                        <div className="text-gray-700 text-sm leading-relaxed">{exercise.description}</div>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                            {exercise.muscleGroups.map((muscle) => (
                                <span key={muscle} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                    {muscle}
                                </span>
                            ))}
                            {exercise.equipment.map((eq) => (
                                <span key={eq} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                                    {eq}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* アクションボタン */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => onStartWorkout(workout)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    トレーニング開始
                </button>
                <button
                    onClick={() => onSaveWorkout(workout)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    メニュー保存
                </button>
            </div>
        </div>
    );
}