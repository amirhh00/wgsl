import { cookies } from "next/headers";
import { pool } from "@/lib/utils/db.mjs";
import sql from "sql-template-strings";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default async function FeedBack() {
  const quizId = cookies().get("quizId");
  const feedbackId = cookies().get("feedbackId");

  let quizResult: QuizResult | undefined;
  if (quizId) {
    const quizResultQuery = await pool.query<QuizResult>(sql`SELECT * FROM quiz_results WHERE id = ${quizId.value}`);
    quizResult = quizResultQuery.rows[0];
  }

  let feedbackResult: FeedBackResult | undefined;
  if (feedbackId) {
    const feedbackQuery = await pool.query<FeedBackResult>(sql`SELECT * FROM feedbacks WHERE id = ${feedbackId.value}`);
    feedbackResult = feedbackQuery.rows[0];
  }

  return (
    <div className="container prose dark:prose-invert max-w-lg py-3">
      <h1>Feedback</h1>
      <p className="text-sm text-gray-500">
        {feedbackResult
          ? " You already provided feedback for the quiz. You can update it here."
          : "Thank you for participating in our study. Your feedback is invaluable in helping us improve our web application. Please take a few minutes to answer the following questions:"}
      </p>
      <form className="flex flex-col gap-3 mt-2 mb-8" action="/api/feedback" method="POST">
        <label className="text-sm" htmlFor="overallExperience">
          How would you rate your overall experience with the web application?
        </label>
        <Select name="overallExperience" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="Very Good">Very Good</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
            <SelectItem value="Poor">Poor</SelectItem>
          </SelectContent>
        </Select>

        <label className="text-sm" htmlFor="useFrequency">
          How often did you use the web application?
        </label>
        <Select name="useFrequency" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Rarely">Rarely</SelectItem>
          </SelectContent>
        </Select>

        <label className="text-sm" htmlFor="device">
          What device did you primarily use to access the web application?
        </label>
        <Select name="device" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Desktop/Laptop">Desktop/Laptop</SelectItem>
            <SelectItem value="Smartphone/Tablet">Smartphone/Tablet</SelectItem>
          </SelectContent>
        </Select>

        <label className="text-sm" htmlFor="interface">
          Did you find the user interface intuitive and easy to navigate?
        </label>
        <Select name="interface" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>

        <label className="text-sm" htmlFor="content">
          Did you find the content of the web application helpful in understanding WGSL concepts?
        </label>
        <Select name="content" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>

        <label className="text-sm" htmlFor="interactive">
          Were the interactive examples and exercises beneficial in learning WGSL?
        </label>
        <Select name="interactive" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>

        <label className="text-sm" htmlFor="technicalIssues">
          Did you encounter any technical issues while using the web application?
        </label>
        <Select name="technicalIssues" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>

        <label className="text-sm" htmlFor="message">
          If you have any additional feedback, please write it here.
        </label>
        <Textarea id="message" name="message" placeholder="Type your message here." defaultValue={feedbackResult?.message} />

        <label className="text-sm" htmlFor="emailInput">
          You can write your email here if you want to be contacted for further feedback.
        </label>
        <Input id="emailInput" name="email" type="email" placeholder="Email" defaultValue={feedbackResult?.email} />
        {quizId && <input type="hidden" name="quizId" value={quizId.value} />}
        {feedbackResult && <input type="hidden" name="feedbackId" value={feedbackResult.id} />}
        <Button className="self-start" type="submit" variant="outline">
          {feedbackResult ? "Update Feedback" : "Submit Feedback"}
        </Button>
      </form>
    </div>
  );
}
