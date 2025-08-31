import { useState, useEffect } from 'react';
import { WorkoutMenu, WorkoutHistory, UserPreferences } from '../types';
import { generateWorkoutMenu, generateHistoryBasedMenu } from '../ai';
import { databaseUtils } from '../database';

export const useWorkout = () => {
    // 状態管理
    const [preferences, setPreferences] = useState<UserPreferences>({
        targetMuscle: '胸',
        level: 'beginner',
        availableTime: 30,
        equipment: ['なし']
    });

    const [currentMenu, setCurrentMenu] = useState<WorkoutMenu | null>(null);
    const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 初期化時に履歴を読み込み
    useEffect(() => {
        loadHistory();
    }, []);

    // 履歴読み込み
    const loadHistory = async () => {
        try {
            const history = await databaseUtils.getRecentWorkoutHistory(20);
            setWorkoutHistory(history);
        } catch (error) {
            console.error('履歴読み込みエラー:', error);
        }
    };

    // メニュー生成
    const generateMenu = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const menu = await generateWorkoutMenu(preferences);
            setCurrentMenu(menu);
            await databaseUtils.saveWorkoutMenu(menu);
        } catch (error) {
            setError('メニュー生成に失敗しました');
            console.error('メニュー生成エラー:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 履歴ベース提案
    const generateHistoryBasedMenuAsync = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const menu = await generateHistoryBasedMenu(preferences, workoutHistory);
            setCurrentMenu(menu);
            await databaseUtils.saveWorkoutMenu(menu);
        } catch (error) {
            setError('履歴ベース提案に失敗しました');
            console.error('履歴ベース提案エラー:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        preferences,
        setPreferences,
        currentMenu,
        workoutHistory,
        isLoading,
        error,
        generateMenu,
        generateHistoryBasedMenuAsync,
        loadHistory
    };
}
