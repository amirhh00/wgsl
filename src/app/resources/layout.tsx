import React from "react";

const StepLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <article
      id="stepArticle"
      className="
            container
            prose dark:prose-invert
            prose-headings:mt-0
            prose-headings:font-semibold
          prose-headings:text-black
            prose-h1:text-5xl prose-h2:text-4xl
            prose-h3:text-3xl prose-h4:text-2xl
            prose-h5:text-xl prose-h6:text-lg
            prose-p:text-justify
          dark:prose-headings:text-white
          "
    >
      {children}
    </article>
  );
};

export default StepLayout;
