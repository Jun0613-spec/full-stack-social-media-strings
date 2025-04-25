import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

import { ToastContainer } from "react-toastify";

import { ThemeProvider } from "./providers/theme-provider.tsx";
import QueryProvider from "./providers/query-provider.tsx";

import Modals from "./components/modals/Modals.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <ToastContainer />
          <Modals />
          <App />
        </ThemeProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
);
