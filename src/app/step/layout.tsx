import React from "react";
import ScrollBarHorizontal from "@/components/etc/ScrollBarHorizontal";

const StepLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ScrollBarHorizontal />
      <article
        id="stepArticle"
        className="prose prose-headings:mt-0 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white py-[calc(1.5rem_+_24px)] dark:prose-invert prose-p:text-justify container xl:max-w-3xl"
      >
        {children}
      </article>
    </>
  );
};

export default StepLayout;
