import React from "react";

export default function Footer() {
  return (
    <footer className="w-full px-6 bg-secondary z-20">
      <div className="flex container mx-auto flex-wrap py-4 items-center pl-[var(--side-nav-width)] transition-[padding]">
        <h2>Footer</h2>
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
