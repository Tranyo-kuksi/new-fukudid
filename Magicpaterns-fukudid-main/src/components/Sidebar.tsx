import React from 'react';
import { 
  FiEdit3, 
  FiCalendar, 
  FiSmile, 
  FiSettings,
  FiX
} from 'react-icons/fi';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  sidebarOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: 'today', icon: <FiEdit3 className="w-5 h-5" />, label: 'Write' },
  { id: 'entries', icon: <FiCalendar className="w-5 h-5" />, label: 'History' },
  { id: 'moods', icon: <FiSmile className="w-5 h-5" />, label: 'Moods' },
  { id: 'settings', icon: <FiSettings className="w-5 h-5" />, label: 'Settings' }
];

export function Sidebar({ activeSection, setActiveSection, sidebarOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg md:shadow-none
          transform transition-transform duration-200 ease-in-out z-30
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveSection(item.id);
                      if (window.innerWidth < 768) {
                        onClose();
                      }
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                      ${
                        activeSection === item.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* App info */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              FakUdid
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Version 1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}