import { cookies } from "next/headers";

export const dynamic = "force-static";

const quizLevels = [
  {
    questions: {
      question: "What is 1 + 1?",
      options: ["1", "2", "3", "4"],
      answer: "2",
    },
  },
  {
    questions: {
      question: "What is 4 + 4?",
      options: ["1", "2", "3", "8"],
      answer: "8",
    },
  },
];

export async function GET(request: Request) {
  const cookieStore = cookies();
  const level = cookieStore.get("level");
  const resHeaders = new Headers();
  resHeaders.set("Content-Type", "application/json");
  if (!level) {
    // Set the level cookie to 1 if it doesn't exist, it should set as httpOnly
    resHeaders.set("Set-Cookie", "level=1; HttpOnly");
  }

  const quiz = quizLevels[Number(level?.value || 1) - 1];

  return new Response(JSON.stringify(quiz), {
    headers: resHeaders,
  });
}
