import { signIn } from "@/lib/utils/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export default function SignIn() {
  return (
    <div className="flex justify-center items-center max-w-lg mx-auto">
      <form
        className="flex gap-6 flex-col p-6 rounded-lg shadow-lg dark:shadow-slate-500/20"
        action={async (formData) => {
          "use server";
          await signIn("credentials", {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            redirect: true,
            redirectTo: "/admin",
          });
        }}
      >
        <label>
          Email
          <Input name="email" type="email" />
        </label>
        <label>
          Password
          <Input name="password" type="password" />
        </label>
        <Button className="">Sign In</Button>
      </form>
    </div>
  );
}
