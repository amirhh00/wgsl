import { auth } from "@/lib/utils/auth";
import { permanentRedirect } from "next/navigation";

export default async function layout(props: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    return permanentRedirect("/auth/signin");
  }
  return <>{props.children}</>;
}
