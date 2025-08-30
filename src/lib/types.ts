// 筋トレメニュー生成の型定義

export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: string;
    restTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
    description: string;
    muscleGroups: string[];
    equipment: string[];
}

export interface WorkoutMenu {
    id: string;
    name: string;
    targetMuscles: string; // 鍛えたい部位
    level: 'beginner' | 'intermediate' | 'advanced';
    duration: number; // 分
    equipment: string[];
    exercises: Exercise[];
    createdAt: string;
    executedAt?: string; // 実行日時
    isExecuted: boolean; // 実行済みかどうか
}

export interface WorkoutHistory {
    id: string;
    menuId: string;
    executedAt: string;
    duration: number; // 実際の実行時間
    notes?: string; // メモ
    rating?: number; // 1-5の評価
}

export interface UserPreferences {
    targetMuscle: string; // 鍛えたい部位
    level: string;
    availableTime: number;
    equipment: string[];
}

export const TARGET_MUSCLES = [
    '胸',
    '背中',
    '腕',
    '脚',
    '腹筋',
    '肩',
    '全身',
] as const;

export const EQUIPMENT = [
]