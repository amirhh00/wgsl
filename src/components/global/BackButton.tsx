"use client";

export default function BackButton() {
  if (typeof window === "undefined") return null;
  if (!window.history || !window.history.back || typeof window.history.back !== "function" || window.history.length < 2) return null;
  return (
    <button className="button h-full" onClick={() => window.history.back()}>
      <svg className="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Go Back
    </button>
  );
}
