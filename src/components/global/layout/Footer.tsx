import { Session } from "next-auth";
import { signOut } from "@/lib/utils/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { menuNavLinks } from "./navLink";

import { headers } from "next/headers";

interface FooterProps {
  session?: Session | null;
  pathname: string;
}

const Footer: React.FC<FooterProps> = (props) => {
  const headerList = headers();
  const pathname = headerList.get("x-current-path");
  const isStep = pathname?.includes("/step");

  return (
    <footer className="w-full flex px-6 bg-secondary z-20 overflow-x-hidden">
      {isStep && <div className="smd:w-[var(--side-nav-width)] h-px transition-[width] flex-shrink-0" />}
      <div className="flex container mx-auto flex-wrap py-4 items-center">
        <div className="flex flex-1 justify-center gap-4 md:gap-10 transition-all">
          <ul className="flex flex-1 justify-center gap-4 md:gap-10 transition-all">
            {menuNavLinks.map((navItem) => (
              <li key={navItem.link} className="text-center">
                <a href={navItem.link} className="text-center w-full" aria-current={pathname === navItem.link ? "page" : undefined}>
                  {navItem.name}
                </a>
              </li>
            ))}
            {props.session ? (
              <div className="flex gap-4">
                <form
                  className=""
                  action={async (formData) => {
                    "use server";
                    await signOut({ redirect: true, redirectTo: "/" });
                  }}
                >
                  <Button className="items-baseline p-0 h-auto" variant="ghost">
                    Sign out
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link href="/auth/signin">Sign In</Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
