import Signin from "@/components/auth/Signin";
import { auth } from "@/lib/utils/auth";
import Signout from "@/components/auth/Signout";

export default async function SignIn() {
  const session = await auth();
  if (session) return <Signout />;

  return <Signin />;
}
