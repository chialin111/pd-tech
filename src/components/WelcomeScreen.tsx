import React, { useState } from 'react';

interface WelcomeScreenProps {
    onStart: (name: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('請輸入姓名以開始測驗');
            return;
        }
        onStart(name.trim());
    };

    return (
        <div className="container animate-in" style={{ paddingTop: '10vh' }}>
            <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '2rem'
                }}>
                    <img src="/cch-logo.png" alt="Institution Logo" style={{ maxWidth: '180px', height: 'auto' }} />
                </div>

                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>腹膜透析<br />知識技術學習成效評估</h1>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                    請輸入您的姓名以開始進行評估。
                    <br />
                    系統將會記錄您的作答結果。
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '100%', maxWidth: '300px' }}>
                        <input
                            type="text"
                            placeholder="您的姓名"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            autoFocus
                        />
                        {error && <div style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</div>}
                    </div>

                    <button type="submit" className="btn-primary" style={{ minWidth: '150px' }}>
                        開始評估
                    </button>
                </form>
            </div>
        </div>
    );
};
