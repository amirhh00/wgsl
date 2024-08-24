import MonacoEditorFull from "@/components/global/MonacoEditorFull";
import { permanentRedirect } from "next/navigation";

export default function Home() {
  if (typeof window === "undefined") {
    return permanentRedirect("/step/introduction");
  }

  return (
    <div className="flex h-full justify-center items-center">
      {/* <MonacoEditorFull />*/}
      {/* loading svg */}
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="9" fill="none"></circle>
        <circle cx="50" cy="50" r="45" stroke="#000" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="283" strokeDashoffset="75">
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
