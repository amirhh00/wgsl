import React from "react";

const LoadingSpinner: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <div {...props}>
      <svg className="w-full h-full min-h-6 min-w-6" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="9" fill="none"></circle>
        <circle cx="50" cy="50" r="45" stroke="#000" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="283" strokeDashoffset="75">
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
