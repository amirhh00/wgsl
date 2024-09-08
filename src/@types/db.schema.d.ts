type QuizResult = {
  id: number;
  score: number;
  results: {
    question: string;
    options: string[];
    answer: number;
    userAnswer: number;
  }[];
  created_at: string;
};
