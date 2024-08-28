import { auth } from "@/lib/utils/auth";
import { permanentRedirect } from "next/navigation";
import LoadingSpinner from "@/components/global/LoadingSpinner";

export default async function Page() {
  const session = await auth();
  if (!session) {
    if (typeof window === "undefined") {
      permanentRedirect("/auth/signin");
    }
  }

  return (
    <div className="flex prose dark:prose-invert flex-1 items-center justify-center">
      <h1 className="text-center">quiz results go here</h1>
    </div>
  );
}
