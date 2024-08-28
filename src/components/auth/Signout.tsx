import { signOut } from "@/lib/utils/auth";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <div className="flex justify-center items-center max-w-lg mx-auto">
      <form
        className="flex gap-6 flex-col p-6 rounded-lg shadow-lg dark:shadow-slate-500/20"
        action={async (formData) => {
          "use server";
          await signOut({ redirect: true, redirectTo: "/" });
        }}
      >
        <Button className="">Sign out</Button>
      </form>
    </div>
  );
}
