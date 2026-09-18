import React from "react";
import ReactDOM from "react-dom/client";
import BitcoinDashboard from "./BitcoinDashboard.jsx";
import { ErrorBoundary } from "./components/shared.jsx";

// The root boundary is the last line of defence: if the shell itself throws,
// the reader gets the "didn't load — reload" card instead of a blank page.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BitcoinDashboard />
    </ErrorBoundary>
  </React.StrictMode>
);
