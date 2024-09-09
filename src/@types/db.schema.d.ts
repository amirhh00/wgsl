type QuizResult = {
  id: number;
  score: number;
  results: {
    question: string;
    options: string[];
    answer: number;
    userAnswer: number;
  }[];
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
