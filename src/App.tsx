import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./components/auth/LoginPage";

export function App() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
} 