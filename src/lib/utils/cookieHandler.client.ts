type CookieOptions = {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
};

function getCookie(key: string): string | void {
  if (typeof document === 'undefined') {
    return;
  }

  const cookie = document.cookie.split('; ').find((row) => row.startsWith(key));

  return cookie?.split('=')[1];
}

function setCookie(key: string, value: string, options?: CookieOptions): void {
  if (typeof document === 'undefined') {
    return;
  }

  let cookieString = `${key}=${value}`;

  if (options) {
    if (options.expires) {
      const expires =
        options.expires instanceof Date
          ? options.expires.toUTCString()
          : new Date(Date.now() + options.expires).toUTCString();

      cookieString += `; expires=${expires}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += '; secure';
    }
  }

  document.cookie = cookieString;
}

export function cookieHandlerClient(key: string, value?: string, options?: CookieOptions): string | void {
  if (typeof value === 'undefined') {
    return getCookie(key);
  }

  setCookie(key, value, options);
}
