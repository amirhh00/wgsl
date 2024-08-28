"use client";

import { useBreakpoint } from "@/lib/hooks/useBreakpoint";
import { usePathname } from "next/navigation";

import React, { useEffect } from "react";

export default function NavigationClient() {
  const { isAboveMd } = useBreakpoint("md");
  const pathName = usePathname();

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

  const isStep = pathName.includes("/step");

  return (
    <>
      {isStep && (
        <button onClick={() => toggle()} className="h-10 w-10 md:hidden shrink-0 bg-white/10">
          ☰
        </button>
      )}
    </>
  );
}
