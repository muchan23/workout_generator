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
        </div>
    )
}