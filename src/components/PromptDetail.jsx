import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';

const { FiX, FiCopy, FiEdit2, FiTrash2, FiTag, FiCode, FiCalendar, FiFolder } = FiIcons;

const PromptDetail = ({ prompt, onClose, onEdit, onCopy }) => {
  const { data, deletePrompt } = useData();
  const [copied, setCopied] = useState(false);

  const folder = data.folders.find(f => f.id === prompt.folderId);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${prompt.title}"?`)) {
      deletePrompt(prompt.id);
      onClose();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {prompt.title}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
          </motion.button>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              copied 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            <SafeIcon icon={FiCopy} className="w-4 h-4" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
          >
            <SafeIcon icon={FiEdit2} className="w-4 h-4" />
            <span>Edit</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          {folder && (
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFolder} className="w-4 h-4" />
              <span>{folder.name}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCalendar} className="w-4 h-4" />
            <span>Updated {format(new Date(prompt.updatedAt), 'MMM d, yyyy')}</span>
          </div>

          {prompt.shortcut && (
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCode} className="w-4 h-4" />
              <span>{prompt.shortcut}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Tags */}
          {prompt.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                <SafeIcon icon={FiTag} className="w-4 h-4" />
                <span>Tags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Variables */}
          {prompt.variables && prompt.variables.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Variables</h3>
              <div className="space-y-2">
                {prompt.variables.map((variable) => (
                  <div
                    key={variable.name}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
                  >
                    <span className="font-mono text-sm text-primary-600 dark:text-primary-400">
                      {`{{${variable.name}}}`}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {variable.defaultValue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Content</h3>
            <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                {prompt.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;