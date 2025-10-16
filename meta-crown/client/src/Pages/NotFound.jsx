import React from "react";
import NotFoundImg from "../Assets/404.png";

export default function NotFound() {
  const wrap = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: "calc(100vh - 120px)",
    padding: "20px",
  };
  return (
    <div style={wrap}>
      <img
        src={NotFoundImg}
        alt="Page not found"
        style={{ maxWidth: "60%", width: "100%", height: "auto" }}
      />
    </div>
  );
}