import { permanentRedirect } from "next/navigation";
import LoadingSpinner from "../components/global/LoadingSpinner";

export default function Home() {
  if (typeof window === "undefined") {
    return permanentRedirect("/step/introduction");
  }

  return (
    <div className="flex h-full justify-center items-center">
      <LoadingSpinner />
    </div>
  );
}
