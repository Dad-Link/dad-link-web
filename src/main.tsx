// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Ensure `App` is imported correctly
import "./styles/App.css"; // Include global styles if applicable

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
