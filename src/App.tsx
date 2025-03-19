import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { JournalProvider } from "./context/JournalContext";
import { LoginPage } from "./components/auth/LoginPage";

export function App() {
  return (
    <AuthProvider>
      <JournalProvider>
        <LoginPage />
      </JournalProvider>
    </AuthProvider>
  );
} 