// main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary";

// ✅ Auth Providers
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

// Optional providers
import { SocketProvider } from "./context/SocketContext.jsx";

// Global styles (optional)
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <SocketProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </SocketProvider>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
