'use client';

import { useBreakpoint } from '@/lib/hooks/useBreakpoint';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function NavigationClient() {
  const { isAboveMd } = useBreakpoint('md');
  const pathName = usePathname();
  const { setTheme, resolvedTheme: theme } = useTheme();

  const toggle = () => {
    const sideNavOpenWidth = getComputedStyle(document.body).getPropertyValue('--nav-open-width');
    const sideNavWidth = document.documentElement.style.getPropertyValue('--side-nav-width');
    document.documentElement.style.setProperty('--side-nav-width', sideNavWidth === '0px' ? sideNavOpenWidth : '0px');
    document.documentElement.style.setProperty('--side-nav-display', sideNavWidth === '0px' ? 'flex' : 'none');
  };
  useEffect(() => {
    const sideNavOpenWidth = getComputedStyle(document.body).getPropertyValue('--nav-open-width');
    if (isAboveMd) {
      document.documentElement.style.setProperty('--side-nav-width', sideNavOpenWidth);
    } else {
      document.documentElement.style.setProperty('--side-nav-width', '0px');
    }
  }, [isAboveMd]);

  const isStep = pathName.includes('/step');
  return (
    <>
      {isStep && (
        <button onClick={() => toggle()} className="h-10 w-10 md:hidden shrink-0 bg-white/10">
          ☰
        </button>
      )}
      <Button
        className="p-2"
        variant="ghost"
        size="icon"
        onClick={() => {
          setTheme(theme === 'dark' ? 'light' : 'dark');
        }}
      >
        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M448 256c0-106-86-192-192-192l0 384c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
        </svg>
      </Button>
    </>
  );
}
