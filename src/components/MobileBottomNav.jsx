import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../contexts/DataContext';
import Settings from './Settings';

const { FiHome, FiSearch, FiFolder, FiPlus, FiSettings } = FiIcons;

const MobileBottomNav = ({ onOpenSearch, onToggleSidebar, viewMode, setViewMode }) => {
  const { setCurrentFolder } = useData();
  const [showSettings, setShowSettings] = useState(false);

  const handleHomeClick = () => {
    setCurrentFolder(null);
  };

  return (
    <>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 px-4 py-2 z-40 md:hidden"
      >
        <div className="flex items-center justify-around">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHomeClick}
            className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <SafeIcon icon={FiHome} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-xs text-gray-600 dark:text-gray-300">Home</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSearch}
            className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <SafeIcon icon={FiSearch} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-xs text-gray-600 dark:text-gray-300">Search</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center space-y-1 p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSidebar}
            className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <SafeIcon icon={FiFolder} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-xs text-gray-600 dark:text-gray-300">Folders</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <SafeIcon icon={FiSettings} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-xs text-gray-600 dark:text-gray-300">Settings</span>
          </motion.button>
        </div>
      </motion.div>

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
            className="bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto max-w-full"
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
              isMobile={true}
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default MobileBottomNav;