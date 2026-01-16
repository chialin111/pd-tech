export interface Question {
  id: string;
  text: string;
  imgUrl?: string; // Optional background/context image
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
}

export interface UserResponse {
  questionId: string;
  selectedOption: string; // 'A' | 'B' | 'C' | 'D' | 'E'
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  details: {
    questionId: string;
    questionText: string;
    userAnswer: string;
    isCorrect: boolean;
    correctAnswer: string; // Returned by backend after grading
    explanation: string; // Detailed explanation (Column J)
  }[];
}

export interface User {
  name: string;
}
