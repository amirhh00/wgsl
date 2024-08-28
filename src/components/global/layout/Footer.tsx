"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function Footer() {
  const pathName = usePathname();
  const isStep = pathName.includes("/step");
  return (
    <footer className="w-full flex px-6 bg-secondary z-20 overflow-x-hidden">
      {isStep && <div className="sm:w-[var(--side-nav-width)] h-px transition-[width] flex-shrink-0" />}
      <div className="flex container mx-auto flex-wrap py-4 items-center">
        <div className="flex flex-1 justify-center gap-4 md:gap-10 transition-all">
          <ul className="flex flex-1 justify-center gap-4 md:gap-10 transition-all">
            <li className="text-center">
              <a href="/home" className="text-center w-full">
                Home
              </a>
            </li>
            <li className="text-center">
              <a href="/about" className="text-center w-full">
                About
              </a>
            </li>
            <li className="text-center">
              <a href="/contact" className="text-center w-full">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
