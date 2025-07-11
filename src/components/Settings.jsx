import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

const { FiSun, FiMoon, FiGrid, FiList, FiLogOut, FiStar, FiClock, FiAlphabet, FiSortAsc, FiSortDesc, FiDownload, FiUpload } = FiIcons;

const Settings = ({ onClose, viewMode, setViewMode, isMobile }) => {
  const { isDark, toggleTheme } = useTheme();
  const { sortType, setSortType, sortDirection, setSortDirection, clearUserData, exportData, importData, data } = useData();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out? This will clear all local data.')) {
      clearUserData();
      window.location.reload();
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          importData(importedData);
        } catch (error) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'promptbox-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const sortOptions = [
    { id: 'name', label: 'Name', icon: FiAlphabet },
    { id: 'date', label: 'Date', icon: FiClock },
    { id: 'favorites', label: 'Favorites', icon: FiStar }
  ];

  return (
    <div className="h-full bg-white dark:bg-dark-800 overflow-y-auto">
      <div className="p-4 md:p-6 space-y-6">
        {/* Appearance */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h2>
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Theme</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
              >
                <SafeIcon icon={isDark ? FiSun : FiMoon} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            </div>

            {/* View Mode */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">View Mode</span>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <SafeIcon icon={FiGrid} className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <SafeIcon icon={FiList} className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* Sorting */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sorting
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Sort By</span>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg text-gray-700 dark:text-gray-300 border-none focus:ring-2 focus:ring-primary-500"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Direction</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
              >
                <SafeIcon
                  icon={sortDirection === 'asc' ? FiSortAsc : FiSortDesc}
                  className="w-5 h-5 text-gray-600 dark:text-gray-300"
                />
              </motion.button>
            </div>
          </div>
        </section>

        {/* Data Management - New section for import/export */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Data Management
          </h2>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
            >
              <SafeIcon icon={FiDownload} className="w-5 h-5" />
              <span>Export Data</span>
            </motion.button>
            
            <label className="w-full">
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <SafeIcon icon={FiUpload} className="w-5 h-5" />
                <span>Import Data</span>
              </motion.div>
            </label>
          </div>
        </section>

        {/* Account */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account
          </h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <SafeIcon icon={FiLogOut} className="w-5 h-5" />
            <span>Log Out</span>
          </motion.button>
        </section>
      </div>
    </div>
  );
};

export default Settings;