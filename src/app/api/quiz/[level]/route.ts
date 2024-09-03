import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { quizLevels } from "@/app/quiz/[level]/questions";
import { pool } from "@/lib/utils/db.mjs";
import SQL from "sql-template-strings";

export type QuizResults = {
  userAnswer: number;
  question: string;
  options: string[];
  answer: number;
}[];

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  try {
    // get the answer and level from the request body form data
    const body = await request.formData();
    const answer: number | undefined = Number(body.get("answer"));
    const level = Number(body.get("level"));
    if (!level) throw new Error("You need to start a quiz first");
    // if (!answer) throw new Error("You need to provide an answer");

    if (level > quizLevels.length || level < 1) throw new Error("level is out of range");
    // check if the answer is in range of the options
    if (answer) {
      if (quizLevels[level - 1].options.length < answer) {
        throw new Error("answer is out of range");
      }
      cookieStore.set(`answer-${level}`, answer.toString(), { httpOnly: true });
    }
    cookieStore.set("level", level.toString(), { httpOnly: true });

    // check if the level is the last level of the quiz, if so return the score else redirect to the next level page
    if (level === quizLevels.length) {
      const quizResults = quizLevels.map((quiz, index) => {
        const answerCookie = cookieStore.get(`answer-${index + 1}`);
        if (!answerCookie?.value) throw new Error("You need to complete the quiz first");
        const userAnswer = Number(answerCookie.value);
        return { ...quiz, userAnswer };
      });
      const score = quizResults.reduce((acc, quiz) => {
        return quiz.answer === quiz.userAnswer ? acc + 1 : acc;
      }, 0);
      await pool.query(SQL`INSERT INTO quiz_results (score, results) VALUES (${score}, ${JSON.stringify(quizResults)})`);
      return new Response(JSON.stringify({ message: "You have completed the quiz" }), {
        status: 302,
        headers: {
          Location: "/quiz/score",
          "Content-Type": "application/json",
        },
      });
    }
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/quiz/${level + 1}`,
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
