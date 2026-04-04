import React from "react";

interface PreviewWrapperProps {
  Component: React.ComponentType<any>;
  previewData: any;
}

const PreviewWrapper: React.FC<PreviewWrapperProps> = ({
  Component,
  previewData,
}) => {
  return (
    <div id="livepreviewsection"
      style={{
        marginTop: "2rem",
        padding: "5px",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        background: "#fafafa",
      }}
    >

      <div
        style={{
          background: "white",
          borderRadius: 6,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <Component overrideData={previewData} />
      </div>
    </div>
  );
};

export default PreviewWrapper;