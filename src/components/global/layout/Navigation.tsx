import { menuNavLinks } from "./navLink";
import Image from "next/image";
import Link from "next/link";

import type { Session } from "next-auth";
import NavigationClient from "./Navigation.client";
import { signOut } from "@/lib/utils/auth";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  session?: Session | null;
}

const Navigation: React.FC<NavigationProps> = (props) => {
  return (
    <header className="sticky z-30 h-[var(--header-height,40px)] overflow-x-hidden top-0 bg-secondary w-full">
      <nav className="flex h-full items-center gap-4 md:container smd:px-6">
        <NavigationClient />
        <Link href="/">
          <Image priority src="/logo-h-complete.jpg" alt="logo" className="-mt-1" width={120} height={40} />
        </Link>
        <ul className="flex flex-1 justify-center gap-4 md:gap-10 transition-all">
          {menuNavLinks.map((menuItem) => (
            <li key={menuItem.name} className="text-center">
              <a href={menuItem.link.toLowerCase()} className="text-center w-full">
                {menuItem.name}
              </a>
            </li>
          ))}
        </ul>
        {props.session && (
          <div className="flex gap-4">
            <Link href="/admin">Admin Panel</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
