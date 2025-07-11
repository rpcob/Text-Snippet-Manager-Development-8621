import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../contexts/ThemeContext';
import Settings from './Settings';

const { FiMenu, FiSearch, FiMoon, FiSun, FiSettings } = FiIcons;

const Header = ({ onToggleSidebar, onOpenSearch, isMobile, viewMode, setViewMode }) => {
  const { isDark } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-4 py-3 flex items-center justify-between relative z-30"
      >
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <SafeIcon icon={FiMenu} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </motion.button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              PromptBox
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2">
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
            >
              <SafeIcon icon={FiSearch} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden lg:inline">
                Search... ⌘K
              </span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <SafeIcon icon={FiSettings} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </motion.button>
        </div>
      </motion.header>

      {/* Settings Overlay */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto ${
              isMobile ? 'max-w-full' : 'max-w-md'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  Settings
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <SafeIcon icon={FiSettings} className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>
            </div>
            
            <Settings 
              onClose={() => setShowSettings(false)}
              viewMode={viewMode}
              setViewMode={setViewMode}
              isMobile={isMobile}
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Header;