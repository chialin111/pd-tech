import React, { useEffect } from 'react';
import type { QuizResult } from '../types';
import confetti from 'canvas-confetti';
import { Check, X, Home } from 'lucide-react';

interface ResultScreenProps {
    result: QuizResult;
    onRetake: () => void;
    userName: string;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRetake, userName }) => {
    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    const isHighScore = percentage >= 80;

    useEffect(() => {
        if (isHighScore) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#557c93', '#e67e22', '#ffffff']
            });
        }
    }, [isHighScore]);

    return (
        <div className="container animate-in">
            <div className="card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: '#888', marginBottom: '0.5rem', fontSize: '1.2rem' }}>測驗結果</h2>
                <h1 style={{
                    fontSize: '4rem',
                    color: isHighScore ? 'var(--color-accent)' : 'var(--color-text)',
                    marginBottom: '1rem',
                    marginTop: 0
                }}>
                    {percentage}分
                    <span style={{ fontSize: '1.5rem', color: '#999', marginLeft: '1rem' }}>
                        (答對{result.score}題/共{result.totalQuestions}題)
                    </span>
                </h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                    {userName}, {isHighScore ? '做得太棒了！🎉' : '再接再厲！💪'}
                </p>

                <button onClick={onRetake} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Home size={18} /> 返回首頁
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {result.details.map((detail, index) => (
                    <div key={index} className="card" style={{
                        padding: '1.5rem',
                        borderLeft: `5px solid ${detail.isCorrect ? '#2ecc71' : '#e74c3c'}`,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        textAlign: 'left'
                    }}>
                        <div style={{
                            background: detail.isCorrect ? '#d5f5e3' : '#fadbd8',
                            color: detail.isCorrect ? '#27ae60' : '#c0392b',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {detail.isCorrect ? <Check size={18} /> : <X size={18} />}
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#555' }}>
                                Q{index + 1}: {detail.questionText}
                            </div>

                            {/* Only show Question ID, Text, and Explanation */}
                            <div style={{ marginTop: '0.5rem', fontSize: '0.95rem', color: '#444', lineHeight: '1.5', background: '#f8f9fa', padding: '0.8rem', borderRadius: '4px' }}>
                                <strong>解答/觀念解析：</strong>
                                <br />
                                {detail.explanation || '暫無解析'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
