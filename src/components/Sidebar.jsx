import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../contexts/DataContext';
import FolderModal from './FolderModal';

const { FiFolder, FiFolderPlus, FiMoreVertical, FiEdit2, FiTrash2, FiShare2, FiDownload, FiUpload } = FiIcons;

const Sidebar = ({ isOpen }) => {
  const { data, currentFolder, setCurrentFolder, deleteFolder, exportData, importData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setIsModalOpen(true);
  };

  const handleDeleteFolder = (folder) => {
    if (window.confirm(`Are you sure you want to delete "${folder.name}" and all its prompts?`)) {
      deleteFolder(folder.id);
      if (currentFolder?.id === folder.id) {
        setCurrentFolder(null);
      }
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

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -280, opacity: 0 }}
      className="w-70 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 h-full flex flex-col"
    >
      <div className="p-4 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Folders</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          >
            <SafeIcon icon={FiFolderPlus} className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportData}
            className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
          
          <label className="flex-1">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <SafeIcon icon={FiUpload} className="w-4 h-4" />
              <span>Import</span>
            </motion.div>
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {data.folders.map((folder) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`group mb-2 p-3 rounded-lg cursor-pointer transition-all ${
                currentFolder?.id === folder.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                  : 'hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
              onClick={() => handleFolderClick(folder)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: folder.color }}
                  >
                    <span className="text-sm">{folder.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{folder.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {data.prompts.filter(p => p.folderId === folder.id).length} prompts
                    </p>
                  </div>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditFolder(folder);
                      }}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-dark-600"
                    >
                      <SafeIcon icon={FiEdit2} className="w-4 h-4 text-gray-500" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder);
                      }}
                      className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4 text-red-500" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <FolderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFolder(null);
        }}
        folder={editingFolder}
      />
    </motion.div>
  );
};

export default Sidebar;