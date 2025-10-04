import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./components/ui-shared/user-flow.css";
import App from "./App.jsx";

window._NOX_MODE_ = import.meta.env.MODE ?? "development";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    {_NOX_MODE_ ? (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: 20,
          height: 20,
          margin: "10px",
          borderRadius: "50%",
          color: "var(--nox-danger-color)",
          border: "2px solid currentColor",
          // opacity: 0.8,
          backgroundColor: "currentColor",
          zIndex: 99999,
        }}
        title="This Website is still under heavy development"
      ></div>
    ) : (
      void 0
    )}
  </StrictMode>
);
