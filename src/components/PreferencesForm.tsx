import React from 'react';
import { UserPreferences, TARGET_MUSCLES, LEVELS, DURATION, EQUIPMENT } from '../lib/types';

interface PreferencesFormProps {
    preferences: UserPreferences;
    onPreferencesChange: (preferences: UserPreferences) => void;
}

export default function PreferencesForm({ preferences, onPreferencesChange }: PreferencesFormProps) {
    const handleTargetMuscleChange = (targetMuscle: string) => {
        onPreferencesChange({
            ...preferences,
            targetMuscle,
        });
    };

    const handleLevelChange = (level: string) => {
        onPreferencesChange({
            ...preferences,
            level,
        });
    };

    const handleTimeChange = (availableTime: number) => {
        onPreferencesChange({
            ...preferences,
            availableTime,
        });
    };

    const handleEquipmentChange = (equipment: string, isChecked: boolean) => {
        const newEquipment = isChecked
            ? [...preferences.equipment, equipment]
            : preferences.equipment.filter(eq => eq !== equipment);

        onPreferencesChange({
            ...preferences,
            equipment: newEquipment,
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                トレーニング設定
            </h2>

            <form className="space-y-6">
                {/* 鍛えたい部位 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        鍛えたい部位
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {TARGET_MUSCLES.map((muscle) => (
                            <label
                                key={muscle}
                                className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                    preferences.targetMuscle === muscle
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="targetMuscle"
                                    value={muscle}
                                    checked={preferences.targetMuscle === muscle}
                                    onChange={(e) => handleTargetMuscleChange(e.target.value)}
                                    className="sr-only"
                                />
                                <span className="text-sm font-medium"></span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* レベル */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        トレーニングレベル
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {LEVELS.map((level) => {
                            const levelLabels = {
                                beginner: '初心者',
                                intermediate: '中級者',
                                advanced: '上級者'
                            };

                            return (
                                <label
                                    key={level}
                                    className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                        preferences.level === level
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="level"
                                        value={level}
                                        checked={preferences.level === level}
                                        onChange={(e) => handleLevelChange(e.target.value)}
                                        className="sr-only"
                                    />
                                    <span className="text-sm font-medium">{levelLabels[level]}</span>
                                </label>
                            )
                        })}

                    </div>
                </div>

                 {/* トレーニング時間 */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        トレーニング時間
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {DURATION.map((duration) => (
                            <label
                                key={duration}
                                className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                    preferences.availableTime === duration
                                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="duration"
                                    value={duration}
                                    checked={preferences.availableTime === duration}
                                    onChange={(e) => handleTimeChange(Number(e.target.value))}
                                    className="sr-only"
                                />
                                <span className="text-sm font-medium">{duration}分</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 使用器具 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        使用器具（複数選択可）
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {EQUIPMENT.map((equipment) => (
                            <label
                                key={equipment}
                                className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                    preferences.equipment.includes(equipment)
                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={preferences.equipment.includes(equipment)}
                                    onChange={(e) => handleEquipmentChange(equipment, e.target.checked)}
                                    className="sr-only"
                                />
                                <span className="text-sm font-medium">{equipment}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    )
}