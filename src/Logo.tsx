import React from "react";

export const Logo = ({ size = "2rem" }: { size?: string }) => (
  <div style={{
    fontSize: size,
    fontWeight: 900,
    background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.5px",
    display: "inline-block"
  }}>
    Sudarshan
  </div>
);
