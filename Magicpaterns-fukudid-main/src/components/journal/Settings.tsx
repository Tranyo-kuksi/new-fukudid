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

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Settings</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg divide-y dark:divide-gray-700">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiBell className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Reminders</h3>
                <p className="text-sm text-gray-500">Set daily journaling reminders</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg">
              Configure
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiLock className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Privacy</h3>
                <p className="text-sm text-gray-500">Manage your privacy settings</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg">
              Settings
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiBook className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Journal Templates</h3>
                <p className="text-sm text-gray-500">Customize your journal prompts</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg">
              Edit
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiShare2 className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Sharing</h3>
                <p className="text-sm text-gray-500">Manage sharing preferences</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg">
              Options
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiGlobe className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Language</h3>
                <p className="text-sm text-gray-500">Choose your preferred language</p>
              </div>
            </div>
            <select className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiCreditCard className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Subscription</h3>
                <p className="text-sm text-gray-500">Manage your subscription plan</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
              Upgrade
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiMoon className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Theme</h3>
                <p className="text-sm text-gray-500">Toggle light/dark mode</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiSmile className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Mood Icons</h3>
                <p className="text-sm text-gray-500">Customize mood icons</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg">
              Customize
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiTrash2 className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Data Management</h3>
                <p className="text-sm text-gray-500">Export or delete your data</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg">
              Manage
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiLogOut className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Logout</h3>
                <p className="text-sm text-gray-500">Sign out of your account</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 