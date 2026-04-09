import React, { useState } from 'react';
import type { Question, UserResponse } from '../types';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

interface QuizScreenProps {
    questions: Question[];
    onSubmit: (responses: UserResponse[]) => void;
    isSubmitting: boolean;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onSubmit, isSubmitting }) => {
    console.log('QuizScreen mounted. Questions length:', questions.length);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [responses, setResponses] = useState<UserResponse[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const currentQuestion = questions[currentIndex];

    // Default placeholder if no image provided
    const bgImage = currentQuestion.imgUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';
    const hasCustomImage = !!currentQuestion.imgUrl;

    const handleOptionSelect = (key: string) => {
        setSelectedOption(key);
    };

    const handleNext = () => {
        if (!selectedOption) return;

        const newResponses = [
            ...responses,
            { questionId: currentQuestion.id, selectedOption }
        ];
        setResponses(newResponses);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
        } else {
            onSubmit(newResponses);
        }
    };

    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="container animate-in" style={{ paddingBottom: '2rem' }}>
            {/* Progress Bar */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '6px',
                background: '#eee',
                zIndex: 100
            }}>
                <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'var(--color-primary)',
                    transition: 'width 0.3s ease'
                }} />
            </div>

            <div className="card" style={{
                marginTop: '2rem',
                padding: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Image Section */}
                <div
                    className="quiz-image"
                    style={{
                        height: hasCustomImage ? '60vh' : '200px', // Default height for placeholder
                        minHeight: hasCustomImage ? '350px' : undefined,
                        backgroundColor: hasCustomImage ? '#000' : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {hasCustomImage ? (
                        <img
                            src={bgImage}
                            alt="Question context"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${bgImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)'
                            }} />
                        </div>
                    )}

                    <div style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '1.5rem',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        background: hasCustomImage ? 'rgba(0,0,0,0.5)' : undefined,
                        padding: hasCustomImage ? '0.25rem 0.75rem' : undefined,
                        borderRadius: hasCustomImage ? '4px' : undefined,
                        zIndex: 10
                    }}>
                        Question {currentIndex + 1} / {questions.length}
                    </div>
                </div>

                {/* Content Section */}
                <div style={{ padding: '2rem' }}>
                    <h2 style={{
                        marginTop: 0,
                        marginBottom: '2rem',
                        fontSize: '1.4rem',
                        lineHeight: 1.4,
                        color: 'var(--color-text)',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {currentQuestion.text}
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {currentQuestion.options && (Object.keys(currentQuestion.options) as Array<keyof typeof currentQuestion.options>)
                            .filter(key => currentQuestion.options[key] && currentQuestion.options[key].trim() !== '')
                            .map((key) => {
                            const isSelected = selectedOption === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleOptionSelect(key)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        textAlign: 'left',
                                        background: isSelected ? 'rgba(85, 124, 147, 0.1)' : 'white',
                                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                                        borderWidth: '2px',
                                        color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
                                        position: 'relative',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: isSelected ? 'var(--color-primary)' : '#f0f0f0',
                                        color: isSelected ? 'white' : '#666',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        marginRight: '1rem',
                                        fontSize: '0.9rem',
                                        flexShrink: 0
                                    }}>
                                        {key}
                                    </div>
                                    <span style={{ flex: 1, whiteSpace: 'pre-wrap' }}>{currentQuestion.options[key]}</span>
                                    {isSelected && <CheckCircle2 size={20} />}
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            className="btn-primary"
                            disabled={!selectedOption || isSubmitting}
                            onClick={handleNext}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                paddingLeft: '2rem',
                                paddingRight: '2rem',
                                opacity: (!selectedOption || isSubmitting) ? 0.6 : 1,
                                cursor: (!selectedOption || isSubmitting) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isSubmitting ? '提交中...' : (currentIndex === questions.length - 1 ? '完成測驗' : '下一題')}
                            {!isSubmitting && <ChevronRight size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
