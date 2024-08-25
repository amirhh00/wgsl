"use client";
import React, { useEffect } from "react";
import { useBreakpoint } from "@/lib/hooks/useBreakpoint";
import { menuNavLinks } from "./navLink";

export default function Navigation() {
  const { isAboveMd } = useBreakpoint("md");
  const toggle = () => {
    const sideNavOpenWidth = getComputedStyle(document.body).getPropertyValue("--nav-open-width");
    const sideNavWidth = document.documentElement.style.getPropertyValue("--side-nav-width");
    document.documentElement.style.setProperty("--side-nav-width", sideNavWidth === "0px" ? sideNavOpenWidth : "0px");
    document.documentElement.style.setProperty("--side-nav-display", sideNavWidth === "0px" ? "flex" : "none");
  };
  useEffect(() => {
    const sideNavOpenWidth = getComputedStyle(document.body).getPropertyValue("--nav-open-width");
    if (isAboveMd) {
      document.documentElement.style.setProperty("--side-nav-width", sideNavOpenWidth);
    } else {
      document.documentElement.style.setProperty("--side-nav-width", "0px");
    }
  }, [isAboveMd]);

  return (
    <header className="sticky z-20 h-[var(--header-height)] top-0 bg-secondary w-full">
      <nav className="flex h-full items-center gap-4 md:container smd:px-6">
        <button onClick={() => toggle()} className="h-10 w-10 md:hidden bg-white/10">
          ☰
        </button>
        <ul className="flex flex-1 justify-center gap-4 md:gap-10 transition-all">
          {menuNavLinks.map((menuItem) => (
            <li key={menuItem.name} className="text-center">
              <a href={menuItem.link.toLowerCase()} className="text-center w-full">
                {menuItem.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
