type QuizResult = {
  id: number;
  score: number;
  results: {
    question: string;
    options: string[];
    answer: number;
    userAnswer: number;
    userAnswered: boolean;
  }[];
  aifeedback?: string;
  created_at: Date;
};

type FeedBackResult = {
  id: number;
  quiz_result_id: number;
  email: string;
  message: string;
  questionnaire: Record<string, string>;
  created_at: Date;
};
