import React from "react";
import { MenuIcon, XIcon, UserCircleIcon, SearchIcon, SunIcon, MoonIcon, PlusIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

export const Header = ({
  setSidebarOpen,
  sidebarOpen
}: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 shadow-sm">
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>
      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        FakUdid
      </h1>
    </div>

    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
      <div className="flex items-center space-x-1 bg-orange-100 dark:bg-gray-700 px-3 py-1 rounded-full">
        <FaFire className="text-orange-500" />
        <span className="font-semibold">0</span>
      </div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {theme === 'dark' ? (
          <FiSun className="w-5 h-5" />
        ) : (
          <FiMoon className="w-5 h-5" />
        )}
      </button>
    </div>
  </header>;
};