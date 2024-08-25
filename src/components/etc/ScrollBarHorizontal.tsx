"use client";
import React, { useEffect, useRef } from "react";

export default function ScrollBarHorizontal() {
  const scrollbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollbarRef.current) return;
      const { scrollHeight, clientHeight, scrollTop } = document.documentElement;
      const width = (scrollTop / (scrollHeight - clientHeight)) * 100;
      scrollbarRef.current.style.width = `${width}%`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-[var(--header-height)] bottom-0 left-0 right-0 h-1 !px-0">
      <div ref={scrollbarRef} className="h-1 bg-blue-500/50 rounded-r" style={{ width: "0%" }} />
    </div>
  );
}
