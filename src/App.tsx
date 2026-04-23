import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { fetchQuestions, submitQuiz } from './lib/api';
import type { Question, QuizResult, UserResponse } from './types';
import { Loader2 } from 'lucide-react';

type Screen = 'welcome' | 'loading' | 'quiz' | 'submitting' | 'result' | 'error';

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [userName, setUserName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = async (name: string) => {
    setUserName(name);
    setScreen('loading');
    try {
      const data = await fetchQuestions(name);
      setQuestions(data);
      setScreen('quiz');
    } catch (err) {
      console.error(err);
      setErrorMsg('無法載入題目，請稍後再試。');
      setScreen('error');
    }
  };

  const handleSubmitQuiz = async (responses: UserResponse[]) => {
    setScreen('submitting');
    try {
      const resultData = await submitQuiz(userName, responses);
      
      // Save wrong question IDs to localStorage
      const wrongIds = resultData.details
        .filter(d => !d.isCorrect)
        .map(d => d.questionId);
      try {
        localStorage.setItem(`wrongIds_${userName}`, JSON.stringify(wrongIds));
      } catch (e) {
        console.error('Failed to save wrongIds', e);
      }

      setResult(resultData);
      setScreen('result');
    } catch (err) {
      console.error(err);
      setErrorMsg('提交成績失敗，請檢查網路連線。');
      setScreen('error');
    }
  };

  const handleRetake = () => {
    setScreen('welcome');
    setUserName('');
    setQuestions([]);
    setResult(null);
    setErrorMsg('');
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      {screen === 'welcome' && <WelcomeScreen onStart={handleStart} />}

      {screen === 'loading' && (
        <div className="container" style={{ textAlign: 'center', paddingTop: '20vh' }}>
          <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
          <p style={{ marginTop: '1rem', color: '#666' }}>正在準備題目...</p>
        </div>
      )}

      {screen === 'quiz' && (
        <QuizScreen
          questions={questions}
          onSubmit={handleSubmitQuiz}
          isSubmitting={false}
        />
      )}

      {screen === 'submitting' && (
        <div className="container" style={{ textAlign: 'center', paddingTop: '20vh' }}>
          <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
          <p style={{ marginTop: '1rem', color: '#666' }}>正在計算成績...</p>
        </div>
      )}

      {screen === 'result' && result && (
        <ResultScreen
          result={result}
          onRetake={handleRetake}
          userName={userName}
        />
      )}

      {screen === 'error' && (
        <div className="container" style={{ textAlign: 'center', paddingTop: '20vh' }}>
          <div className="card">
            <h2 style={{ color: '#e74c3c' }}>發生錯誤</h2>
            <p>{errorMsg}</p>
            <button className="btn-primary" onClick={handleRetake} style={{ marginTop: '1rem' }}>
              回到首頁
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
