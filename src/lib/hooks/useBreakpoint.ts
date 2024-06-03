"use client";

import { useState, useEffect } from "react";
import { screensCfg } from "../../../tailwind.config";

type TypeNotStartWith<T, N extends string> = T extends `${N}${infer _X}` ? never : T;
type Screens = typeof screensCfg;
type Breakpoint = TypeNotStartWith<Extract<keyof Screens, string>, "s">;

const breakpoints = {} as Record<Breakpoint, string>;

for (const key in screensCfg) {
  const keyName = key as keyof typeof screensCfg;
  if (typeof screensCfg[keyName] === "string") {
    (breakpoints as any)[key] = (screensCfg as any)[key];
  }
}

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

export function useBreakpoint<K extends Breakpoint>(breakpointKey: K) {
  const breakpointValue = breakpoints[breakpointKey as Breakpoint];
  const bool = useMediaQuery(`(min-width: ${breakpointValue})`);
  const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1);

  type KeyAbove = `isAbove${Capitalize<K>}`;
  type KeyBelow = `isBelow${Capitalize<K>}`;

  return {
    [breakpointKey]: Number(String(breakpointValue).replace(/[^0-9]/g, "")),
    [`isAbove${capitalizedKey}`]: bool,
    [`isBelow${capitalizedKey}`]: !bool,
  } as Record<K, number> & Record<KeyAbove | KeyBelow, boolean>;
}

export function useHeightMediaQuery() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const listener = () => setHeight(window.innerHeight);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);

  return { height };
}

export default useMediaQuery;
