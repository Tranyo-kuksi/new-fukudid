import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { JournalContent } from "./components/JournalContent";
import { ThemeProvider } from "./context/ThemeContext";
import { JournalProvider } from "./context/JournalContext";
import { LoginPage } from "./components/auth/LoginPage";
import { useAuth } from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";

export function App() {
  console.log("App component rendering");
  const [activeSection, setActiveSection] = useState("today");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const { user } = useAuth();

  useEffect(() => {
    console.log("App component mounted");
  }, []);

  // Handle initial sidebar state and window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Command/Ctrl + / to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
      // Command/Ctrl + J to create new entry
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setActiveSection('today');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // If user is not authenticated, show login page
  if (!user) {
    return (
      <AuthProvider>
        <ThemeProvider>
          <LoginPage />
        </ThemeProvider>
      </AuthProvider>
    );
  }

  // Main app layout for authenticated users
  return (
    <AuthProvider>
      <ThemeProvider>
        <JournalProvider>
          <div className="flex flex-col w-full min-h-screen bg-pink-50 dark:bg-gray-900 transition-colors duration-200">
            <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
            <div className="flex flex-1 overflow-hidden relative">
              <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              <JournalContent activeSection={activeSection} />
            </div>
          </div>
        </JournalProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}