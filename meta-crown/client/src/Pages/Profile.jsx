import React from "react";
import NotFoundImg from "../Assets/404.png";

export default function Profile() {
  const pageCenterStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: "calc(100vh - 120px)",
    padding: "20px",
  };

  return (
    <div style={pageCenterStyle}>
      <img
        src={NotFoundImg}
        alt="Not available yet"
        style={{
          maxWidth: "30%",
          width: "100%",
          height: "auto",
        }}
      />
    </div>
  );
}