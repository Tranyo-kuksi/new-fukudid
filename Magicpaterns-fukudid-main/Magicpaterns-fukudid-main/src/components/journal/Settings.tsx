import React from 'react';
import { FiUser, FiGlobe, FiCreditCard, FiMoon, FiSmile, FiLogOut, FiBell, FiLock, FiBook, FiShare2, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useJournal } from '../../context/JournalContext';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { streak } = useJournal();
  
  return (
    <div className="p-6 space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Profile</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center">
              <FiUser className="w-10 h-10 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{user?.name || 'Guest User'}</h3>
              <p className="text-gray-500 dark:text-gray-400">Current Streak: {streak} days</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            Edit Profile
          </button>
        </div>
      </section>
      // ... rest of the component
    </div>
  );
} 