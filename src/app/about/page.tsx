import Image from 'next/image';
import React from 'react';

export default function About() {
  return (
    <div className="container mx-auto prose dark:prose-invert flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-center m-2">WGSL 101</h1>
      <Image
        className="dark:mix-blend-difference bg-black dark:p-0 p-4"
        src="/images/uoc_logo.png"
        alt="University Of Chester"
        width={250}
        height={100}
      />
      <p className="text-center m-2">developed by Amirhossein Esmaeili</p>
      <p className="text-center m-2">University Of Chester</p>
    </div>
  );
}
