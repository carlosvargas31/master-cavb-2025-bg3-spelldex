import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Home } from "./pages/home";

import "./index.css";


const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Home />
    </StrictMode>
  );
}
