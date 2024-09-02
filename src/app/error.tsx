"use client";
import Link from "next/link";
import React from "react";

export default function error({ error }: { error: Error }) {
  const handleCleanCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center container justify-center gap-4">
      <h1>there was an unexpected error</h1>
      <p className="text-red-500 text-xs text-center">{error.message}</p>
      <p>you can try cleaning your cache and reloading the page using the following button</p>
      <button className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={handleCleanCache}>
        Reload with clean cache
      </button>
      <Link className="button" href="/">
        Reload withouth cleaning cache
      </Link>
    </div>
  );
}
