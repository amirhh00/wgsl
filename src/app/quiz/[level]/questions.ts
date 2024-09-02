export const quizLevels = [
  {
    question: "What is 1 + 1?",
    options: ["1", "2", "3", "4"],
    answer: 2,
  },
  {
    question: "What is 4 + 4?",
    options: ["1", "2", "3", "8"],
    answer: 4,
  },
];

export type Quiz = Omit<(typeof quizLevels)[0], "answer">;
