import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../contexts/DataContext';

const { FiCopy, FiEdit2, FiTrash2, FiMoreVertical, FiTag, FiCode, FiStar } = FiIcons;

const PromptCard = ({ prompt, viewMode, onEdit, onCopy, onSelect, isMobile }) => {
  const { deletePrompt, toggleFavorite } = useData();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${prompt.title}"?`)) {
      deletePrompt(prompt.id);
    }
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(prompt.id);
  };

  const truncateContent = (content, maxLength = isMobile ? 60 : 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const handleCardClick = () => {
    if (isMobile) {
      onCopy();
    } else {
      onSelect();
    }
  };

  // New class names for mobile list view
  const mobileListClasses = isMobile && viewMode === 'list' 
    ? 'py-2 px-3 mb-1' // Tighter padding and margin for mobile list
    : 'p-4 mb-3'; // Original padding for desktop or grid view

  // New content display classes for mobile list view
  const contentClasses = isMobile && viewMode === 'list'
    ? 'hidden' // Hide content in mobile list view
    : 'text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'; // Original classes

  // New tag display classes for mobile list view
  const tagClasses = isMobile && viewMode === 'list'
    ? 'hidden' // Hide tags in mobile list view
    : 'flex flex-wrap gap-1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isMobile ? { y: -2, scale: 1.01 } : {}}
      whileTap={{ scale: 0.98 }}
      className={`bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg 
        hover:shadow-md transition-all cursor-pointer group 
        ${mobileListClasses}
        ${isMobile ? 'active:bg-gray-50 dark:active:bg-dark-700' : ''}`}
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        <div className={`flex items-center ${isMobile && viewMode === 'list' ? 'space-x-2' : 'space-x-3'}`}>
          {/* Title section */}
          <h3 className={`font-semibold text-gray-900 dark:text-white 
            ${isMobile && viewMode === 'list' ? 'text-sm truncate max-w-[200px]' : 'text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2'}`}>
            {prompt.title}
          </h3>
        </div>

        <div className="flex items-center space-x-1 ml-2">
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-colors ${
                copied
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  : 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/30'
              }`}
            >
              <SafeIcon icon={FiCopy} className="w-4 h-4" />
            </motion.button>
          )}

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors
                ${isMobile && viewMode === 'list' ? 'scale-90' : ''}`}
            >
              <SafeIcon icon={FiMoreVertical} className="w-4 h-4 text-gray-400" />
            </motion.button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-10 bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg shadow-lg py-2 z-20 min-w-[120px]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 flex items-center space-x-2"
                >
                  <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(e);
                    setShowMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-dark-600 flex items-center space-x-2 ${
                    prompt.favorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <SafeIcon icon={FiStar} className="w-4 h-4" />
                  <span>{prompt.favorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Content - Hidden in mobile list view */}
      <p className={contentClasses}>
        {truncateContent(prompt.content)}
      </p>

      {/* Tags - Hidden in mobile list view */}
      {prompt.tags.length > 0 && (
        <div className={tagClasses}>
          {prompt.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PromptCard;