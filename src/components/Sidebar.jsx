import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../contexts/DataContext';
import FolderModal from './FolderModal';

const { FiFolder, FiFolderPlus, FiEdit2, FiTrash2, FiX, FiMoreVertical } = FiIcons;

const FolderMenu = ({ folder, onClose }) => {
  const { deleteFolder } = useData();
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute right-0 top-10 bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg shadow-lg py-2 z-20 min-w-[160px]"
      >
        <button
          onClick={() => {
            setShowEditModal(true);
            onClose();
          }}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 flex items-center space-x-2"
        >
          <SafeIcon icon={FiEdit2} className="w-4 h-4" />
          <span>Edit Folder</span>
        </button>
        {!folder.isSystem && (
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${folder.name}" and all its prompts?`)) {
                deleteFolder(folder.id);
              }
              onClose();
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            <span>Delete Folder</span>
          </button>
        )}
      </motion.div>
      <FolderModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} folder={folder} />
    </>
  );
};

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const { data, currentFolder, setCurrentFolder, getSortedItems } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [showFolderMenus, setShowFolderMenus] = useState({});

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setIsModalOpen(true);
  };

  const toggleFolderMenu = (folderId) => {
    setShowFolderMenus(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -280, opacity: 0 }}
      className={`w-70 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 h-full flex flex-col ${
        isMobile ? 'shadow-xl' : ''
      }`}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Folders</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </motion.button>
        </div>
      )}

      <div className="p-4 border-b border-gray-200 dark:border-dark-700">
        {!isMobile && (
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
        )}

        {/* Mobile Create Folder Button */}
        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="w-full mb-4 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiFolderPlus} className="w-5 h-5" />
            <span>Create Folder</span>
          </motion.button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {getSortedItems(data.folders).map((folder) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`group mb-3 p-3 rounded-lg cursor-pointer transition-all ${
                currentFolder?.id === folder.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                  : 'hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
              onClick={() => handleFolderClick(folder)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                    style={{ backgroundColor: folder.color }}
                  >
                    <span>{folder.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                      {folder.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {data.prompts.filter(p => 
                        folder.id === 'favorites' ? p.favorite : p.folderId === folder.id
                      ).length} prompts
                    </p>
                  </div>
                </div>
                {!folder.isSystem && (
                  <div className={`${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity relative`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFolderMenu(folder.id);
                      }}
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-dark-600"
                    >
                      <SafeIcon icon={FiMoreVertical} className="w-4 h-4 text-gray-500" />
                    </motion.button>
                    {showFolderMenus[folder.id] && (
                      <FolderMenu
                        folder={folder}
                        onClose={() => toggleFolderMenu(folder.id)}
                      />
                    )}
                  </div>
                )}
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
        isMobile={isMobile}
      />
    </motion.div>
  );
};

export default Sidebar;