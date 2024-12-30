import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TvProvider } from "./hooks/useTvCustomHook.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TvProvider>
      <App />
    </TvProvider>
  </StrictMode>
);
