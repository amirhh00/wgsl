type QuizLevelResponse = import('@/app/quiz/[level]/questions').QuizLevel & { userAnswer?: number };

type QuizResult = {
  id: number;
  score: number;
  results: QuizLevelResponse[];
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
