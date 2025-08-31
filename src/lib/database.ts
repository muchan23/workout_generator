import Dexie, { Table } from 'dexie';
import { WorkoutMenu, WorkoutHistory } from './types';

// データベースクラスの定義
export class WorkoutDatabase extends Dexie {

    workoutMenus!: Table<WorkoutMenu>;
    workoutHistory!: Table<WorkoutHistory>;

    constructor() {
        super('WorkoutDatabase');

        // データベースのバージョンとスキーマ定義
        this.version(1).stores({
            workoutMenus: 'id, targetMuscle, createdAt, isExecuted',
            workoutHistory: 'id, menuId, executedAt',
        })
    }
}

// データベースインスタンスの作成
export const db = new WorkoutDatabase();

// データベース操作のユーティリティ関数
export const databaseUtils = {
    // メニューの保存
    async saveWorkoutMenu(menu: WorkoutMenu): Promise<string> {
        return await db.workoutMenus.add(menu);
    },

    // メニューの取得
    async getWorkoutMenu(id: string): Promise<WorkoutMenu | undefined> {
        return await db.workoutMenus.get(id);
    },

    // 全メニューの取得
    async getAllWorkoutMenus(): Promise<WorkoutMenu[]> {
        return await db.workoutMenus.toArray();
    },

    // 部位別メニューの取得
    async getWorkoutMenusByMuscle(targetMuscle: string): Promise<WorkoutMenu[]> {
        return await db.workoutMenus
            .where('targetMuscle')
            .equals(targetMuscle)
            .toArray();
    },

    // メニューの更新
    async updateWorkoutMenu(id: string, updates: Partial<WorkoutMenu>): Promise<void> {
        await db.workoutMenus.update(id, updates);
    },

    // メニューの削除
    async deleteWorkoutMenu(id: string): Promise<void> {
        await db.workoutMenus.delete(id);
    },

    // 履歴の保存
    async saveWorkoutHistory(history: WorkoutHistory): Promise<string> {
        return await db.workoutHistory.add(history);
    },

    // 全履歴の取得
    async getAllWorkoutHistory(): Promise<WorkoutHistory[]> {
        return await db.workoutHistory.toArray();
    },

    // 最近の履歴を取得（最新10件）
    async getRecentWorkoutHistory(limit: number = 10): Promise<WorkoutHistory[]> {
        return await db.workoutHistory
            .orderBy('executedAt')
            .reverse()
            .limit(limit)
            .toArray();
    },

    // データベースの初期化（開発用）
    async clearDatabase(): Promise<void> {
        await db.workoutMenus.clear();
        await db.workoutHistory.clear();
    }      
};