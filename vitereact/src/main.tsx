import { createRoot } from "react-dom/client";
import AppWrapper from "./AppWrapper.tsx";
import "./index.css";

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
    timestamp: new Date().toISOString()
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', {
    reason: event.reason,
    promise: event.promise,
    timestamp: new Date().toISOString()
  });
  // Prevent the default browser behavior
  event.preventDefault();
});

createRoot(document.getElementById("root")!).render(
			<AppWrapper /> 
);
