import React from "react";
import SideNavigation from "@/components/global/layout/SideNavigation";
import ScrollBarHorizontal from "@/components/etc/ScrollBarHorizontal";

const StepLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ScrollBarHorizontal />
      <SideNavigation />
      <section
        className="
          lg:max-w-screen-lg
          max-w-screen-md
          smd:container
          mx-auto
          flex-1
          md:pl-[var(--side-nav-width)]
          md:transition-[padding]
          py-[var(--header-height)]
          min-h-10
          ssm:p-0
        "
      >
        <article
          id="stepArticle"
          className="
            px-4
            max-w-full
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
      </section>
    </>
  );
};

export default StepLayout;
