type QuizLevelResponse = import('@/app/quiz/[level]/questions').QuizLevel & { userAnswer?: number };

type QuizResult = {
  id: number;
  score: number;
  results: QuizLevelResponse[];
  aifeedback?: string;
  created_at: Date;
};

// enum FamiliarityLevel {
//   'Very Familiar' = 4,
//   'Familiar' = 3,
//   'Somewhat Familiar' = 2,
//   'Not Familiar' = 1,
// }

type FeedBackResult = {
  id: number;
  quiz_result_id: number;
  quiz_result_score?: number;
  email: string;
  message: string;
  questionnaire: {
    overallExperience: string;
    shaderLanguages: string;
    programmingLanguagesFamiliarity?: string;
    // rest of the questionnaire
    [key: string]: any;
  };
  created_at: Date;
};
