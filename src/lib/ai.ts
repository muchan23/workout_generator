import { UserPreferences, WorkoutMenu, Exercise, WorkoutHistory } from './types';

// AI生成の設定
const AI_CONFIG = {
    apiKey: process.env.NEXT_PUBLIC_AI_API_KEY || '',
    model: 'gpt-4o'
}

// 部位別メニュー生成
export async function generateWorkoutMenu(preferences: UserPreferences): Promise<WorkoutMenu> {
    try {
        const prompt = createWorkoutMenuPrompt(preferences);
        const response = await callAI(prompt);
        return parseWorkoutResponse(response, preferences);
    } catch (error) {
        console.error('メニュー生成エラー:', error);
        return generateFallbackMenu(preferences);
    }
}

// 履歴ベース提案
export async function generateHistoryBasedMenu(
    preferences: UserPreferences,
    history: WorkoutHistory[]
): Promise<WorkoutMenu> {
    try {
        const prompt = createHistoryBasedPrompt(preferences, history);
        const response = await callAI(prompt);
        return parseWorkoutResponse(response, preferences);
    } catch (error) {
        console.error('履歴ベース提案エラー:', error);
        return generateFallbackMenu(preferences);
    }
}

// 部位別メニュー生成プロンプト作成
function createWorkoutMenuPrompt(preferences: UserPreferences): string {
    return `
以下の条件で筋トレメニューを生成してください：

鍛えたい部位: ${preferences.targetMuscle}
レベル: ${preferences.level}
時間: ${preferences.availableTime}分
使用器具: ${preferences.equipment.join(', ')}

以下のJSON形式で出力してください：
{
  "name": "メニュー名",
  "exercises": [
    {
      "name": "種目名",
      "sets": セット数,
      "reps": "回数（例：8-12）",
      "restTime": 休憩時間（秒）,
      "difficulty": "easy|medium|hard",
      "description": "やり方の説明",
      "muscleGroups": ["対象筋群"],
      "equipment": ["使用器具"]
    }
  ]
}

注意事項：
- 種目数は時間に応じて調整（${preferences.availableTime}分なら${Math.max(3, Math.floor(preferences.availableTime / 10))}-${Math.max(6, Math.floor(preferences.availableTime / 8))}種目）
- セット数はレベルに応じて調整（${preferences.level === 'beginner' ? '2-3' : preferences.level === 'intermediate' ? '3-4' : '4-5'}セット）
- 回数は目標に応じて調整（筋力=5-8回、筋肥大=8-12回、持久力=15-20回）
- 休憩時間は種目・レベルに応じて調整（30秒-3分）
`;
}

// 履歴ベース提案プロンプト作成
function createHistoryBasedPrompt(preferences: UserPreferences, history: WorkoutHistory[]): string {
    const recentHistory = history
        .slice(-5)
        .map(h => `- ${h.executedAt}: ${h.duration}分実行`)
        .join('\n');

    return `
過去のトレーニング履歴を分析して、次回の最適なメニューを提案してください：

過去の履歴:
${recentHistory || '履歴なし'}

現在の条件:
鍛えたい部位: ${preferences.targetMuscle}
レベル: ${preferences.level}
時間: ${preferences.availableTime}分
使用器具: ${preferences.equipment.join(', ')}

前回のトレーニングから考慮すべき点:
- 同じ部位を連続で鍛えすぎないよう配慮
- 負荷の調整
- 種目のバリエーション
- 回復状況
- 継続性

以下のJSON形式で出力してください：
{
  "name": "メニュー名",
  "exercises": [
    {
      "name": "種目名",
      "sets": セット数,
      "reps": "回数（例：8-12）",
      "restTime": 休憩時間（秒）,
      "difficulty": "easy|medium|hard",
      "description": "やり方の説明",
      "muscleGroups": ["対象筋群"],
      "equipment": ["使用器具"]
    }
  ]
}
`;
}

// AI API呼び出し
async function callAI(prompt: string): Promise<string> {
    if (!AI_CONFIG.apiKey) {
        throw new Error('AI APIキーが設定されていません');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: 'system',
                    content: 'あなたは筋トレの専門家です。ユーザーの条件に最適な筋トレメニューを提案してください。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000,
        }),
    });

    if (!response.ok) {
        throw new Error(`AI APIエラー: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
}

// AI応答の解析
function parseWorkoutResponse(response: string, preferences: UserPreferences): WorkoutMenu {
    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('JSONが見つかりません');
        }

        const parsed = JSON.parse(jsonMatch[0]);

        const exercises: Exercise[] = parsed.exercises.map((ex: any, index: number) => ({
            id: 'exercise-${Date.now()}-${index}',
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            restTime: ex.restTime,
            difficulty: ex.difficulty,
            description: ex.description,
            muscleGroups: ex.muscleGroups,
            equipment: ex.equipment,
        }));

        return {
            id: 'menu-${Date.now()}',
            name: parsed.name,
            targetMuscles: preferences.targetMuscle,
            level: preferences.level as 'beginner' | 'intermediate' | 'advanced',
            duration: preferences.availableTime,
            equipment: preferences.equipment,
            exercises,
            createdAt: new Date().toISOString(),
            isExecuted: false,
        };
    } catch (error) {
        console.error('応答解析エラー:', error);
        throw new Error('AI応答の解析に失敗しました');
    }
}

// フォールバックメニュー生成
function generateFallbackMenu(preferences: UserPreferences): WorkoutMenu {
    const fallbackExercises: Exercise[] = [
        {
            id: 'fallback-1',
            name: 'プッシュアップ',
            sets: 3,
            reps: '10-15',
            restTime: 60,
            difficulty: 'medium',
            description: '腕立て伏せで胸と腕を鍛えます。手の幅を肩幅より少し広くして、体を一直線に保ちます。',
            muscleGroups: ['胸', '腕'],
            equipment: ['なし'],
        },
        {
            id: 'fallback-2',
            name: 'スクワット',
            sets: 3,
            reps: '15-20',
            restTime: 60,
            difficulty: 'easy',
            description: '基本的なスクワットで脚を鍛えます。足を肩幅に開き、お尻を下げるように腰を落とします。',
            muscleGroups: ['脚'],
            equipment: ['なし'],
        },
        {
            id: 'fallback-3',
            name: 'プランク',
            sets: 3,
            reps: '30秒',
            restTime: 30,
            difficulty: 'easy',
            description: '体幹を鍛えるプランク。肘を床につき、体を一直線に保ちます。',
            muscleGroups: ['腹筋'],
            equipment: ['なし'],
        },
    ];

    return {
        id: `fallback-${Date.now()}`,
        name: `${preferences.targetMuscle}基本メニュー`,
        targetMuscles: preferences.targetMuscle,
        level: preferences.level as 'beginner' | 'intermediate' | 'advanced',
        duration: preferences.availableTime,
        equipment: preferences.equipment,
        exercises: fallbackExercises,
        createdAt: new Date().toISOString(),
        isExecuted: false,
    };
}