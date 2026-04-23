import type { Question, UserResponse, QuizResult } from '../types';

const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export const fetchQuestions = async (userName?: string): Promise<Question[]> => {
    let wrongIds: string[] = [];
    if (userName) {
        try {
            wrongIds = JSON.parse(localStorage.getItem(`wrongIds_${userName}`) || '[]');
        } catch (e) {
            console.error('Failed to parse wrongIds', e);
        }
    }

    if (!GAS_URL || GAS_URL.includes('YOUR_SCRIPT_ID')) {
        console.warn('Google Apps Script URL is not set. Returning mock data.');
        return mockQuestions(wrongIds);
    }

    try {
        const wrongIdsParam = wrongIds.length > 0 ? `&wrongIds=${wrongIds.join(',')}` : '';
        const response = await fetch(`${GAS_URL}?action=getQuestions${wrongIdsParam}`);
        if (!response.ok) {
            throw new ApiError(`Failed to fetch questions: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        // Fallback to mock data if API fails in dev, or rethrow in prod
        // For now, let's return mock data so the UI works
        return mockQuestions(wrongIds);
    }
};

export const submitQuiz = async (name: string, responses: UserResponse[]): Promise<QuizResult> => {
    if (!GAS_URL || GAS_URL.includes('YOUR_SCRIPT_ID')) {
        console.warn('Google Apps Script URL is not set. Returning mock result.');
        return mockSubmit(name, responses);
    }

    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', // GAS often requires text/plain to avoid preflight options check issues
            },
            body: JSON.stringify({
                action: 'submit',
                payload: {
                    name,
                    responses
                }
            })
        });

        if (!response.ok) {
            throw new ApiError(`Failed to submit quiz: ${response.statusText}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Submit Error:', error);
        return mockSubmit(name, responses);
    }
};

// --- Mock Data ---

const mockQuestions = (wrongIds: string[] = []): Question[] => {
    const questions: Question[] = [
        {
            id: '1',
            text: '進行腹膜透析換液操作前，下列哪項準備工作最重要？',
            options: { A: '打開電視', B: '洗手並戴口罩', C: '喝杯水', D: '關窗戶', E: '整理床鋪' }
        },
        {
            id: '2',
            text: '透析液加熱的適當溫度為多少？',
            options: { A: '25°C', B: '37°C', C: '45°C', D: '50°C', E: '60°C' }
        },
        {
            id: '3',
            text: '接管過程中，若不小心觸碰到接頭，應如何處理？',
            options: { A: '用衛生紙擦拭', B: '用酒精棉片消毒', C: '更換新的輸液管組', D: '繼續操作沒關係', E: '用水沖洗' }
        },
        {
            id: '4',
            text: '排液時，觀察到透析液混濁，可能代表什麼？',
            options: { A: '腹膜炎', B: '正常現象', C: '透析液過期', D: '水分攝取過多', E: '導管阻塞' }
        },
        {
            id: '5',
            text: '注入新透析液或是引流時，若感到腹痛，應先做什麼？',
            options: { A: '加快流速', B: '調整姿勢或減慢流速', C: '立即停止並拔管', D: '服用止痛藥', E: '大叫求救' }
        }
    ];

    for (let i = 6; i <= 31; i++) {
        questions.push({
            id: i.toString(),
            text: i === 31
                ? '第 31 題：這是一個測試題目，用於驗證長文本和圖片的顯示效果。如果腹膜透析患者在操作過程中發現引流液顏色異常（如血色或混濁），且伴隨發燒或腹痛，下列哪項處置最為恰當？'
                : `這是第 ${i} 題的測試題目。`,
            imgUrl: i === 31 ? 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' : undefined,
            options: {
                A: `選項 A (${i})`,
                B: `選項 B (${i})`,
                C: `選項 C (${i})`,
                D: `選項 D (${i})`,
                E: `選項 E (${i})`
            }
        });
    }

    let priorityRows = [];
    let otherRows = [];

    questions.forEach(q => {
        if (wrongIds.includes(q.id)) {
            priorityRows.push(q);
        } else {
            otherRows.push(q);
        }
    });

    priorityRows.sort(() => 0.5 - Math.random());
    otherRows.sort(() => 0.5 - Math.random());

    let selectedRows = [];
    if (priorityRows.length >= 5) {
        selectedRows = priorityRows.slice(0, 5);
    } else {
        selectedRows = priorityRows.concat(otherRows.slice(0, 5 - priorityRows.length));
    }

    return selectedRows.sort(() => 0.5 - Math.random());
};

const mockSubmit = (_name: string, responses: UserResponse[]): Promise<QuizResult> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock calculation
            const calculatedScore = responses.reduce((acc, curr) => {
                return acc + (curr.selectedOption === 'B' ? 1 : 0);
            }, 0);

            const result: QuizResult = {
                score: calculatedScore,
                totalQuestions: responses.length,
                details: responses.map(r => ({
                    questionId: r.questionId,
                    questionText: `Question ${r.questionId}`,
                    userAnswer: r.selectedOption,
                    isCorrect: r.selectedOption === 'B', // Mock logic: B is always right
                    correctAnswer: 'B',
                    explanation: '【系統提示】您目前看到的是模擬資料。這代表您的前端無法成功連接到 Google Apps Script。請檢查：1. 是否已部署 GAS 為「所有使用者 (Anyone)」？ 2. 是否將 GAS 網址正確填入 .env 檔案？ 3. 修改 .env 後是否已重啟開發伺服器？'
                }))
            };
            resolve(result);
        }, 1000);
    });
};
