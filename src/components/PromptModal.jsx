import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../contexts/DataContext';

const { FiX, FiPlus, FiTrash2, FiSave } = FiIcons;

const PromptModal = ({ isOpen, onClose, prompt, folderId, isMobile }) => {
  const { data, addPrompt, updatePrompt } = useData();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    folderId: folderId || '',
    tags: [],
    variables: [],
    shortcut: ''
  });
  const [newTag, setNewTag] = useState('');
  const [newVariable, setNewVariable] = useState({ name: '', defaultValue: '' });

  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title || '',
        content: prompt.content || '',
        folderId: prompt.folderId || folderId || '',
        tags: prompt.tags || [],
        variables: prompt.variables || [],
        shortcut: prompt.shortcut || ''
      });
    } else {
      setFormData({
        title: '',
        content: '',
        folderId: folderId || '',
        tags: [],
        variables: [],
        shortcut: ''
      });
    }
  }, [prompt, folderId, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (prompt) {
      updatePrompt(prompt.id, formData);
    } else {
      addPrompt(formData);
    }
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addVariable = () => {
    if (newVariable.name.trim()) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, { ...newVariable }]
      }));
      setNewVariable({ name: '', defaultValue: '' });
    }
  };

  const removeVariable = (index) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto ${
            isMobile ? 'max-w-full' : 'max-w-2xl'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 md:p-6 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {prompt ? 'Edit Prompt' : 'Create New Prompt'}
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
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter prompt title..."
                required
              />
            </div>

            {/* Folder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Folder
              </label>
              <select
                value={formData.folderId}
                onChange={(e) => setFormData(prev => ({ ...prev, folderId: e.target.value }))}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a folder</option>
                {data.folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.icon} {folder.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={isMobile ? 6 : 8}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your prompt content... Use {{variable}} for variables"
                required
              />
            </div>

            {/* Shortcut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shortcut Code (optional)
              </label>
              <input
                type="text"
                value={formData.shortcut}
                onChange={(e) => setFormData(prev => ({ ...prev, shortcut: e.target.value }))}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="/my-shortcut"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-primary-500 hover:text-primary-700"
                    >
                      <SafeIcon icon={FiX} className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add a tag..."
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Variables */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Variables
              </label>
              <div className="space-y-2 mb-3">
                {formData.variables.map((variable, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <span className="font-mono text-sm text-primary-600 dark:text-primary-400">
                      {`{{${variable.name}}}`}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">→</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">
                      {variable.defaultValue}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeVariable(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="space-y-2 md:space-y-0 md:flex md:space-x-2">
                <input
                  type="text"
                  value={newVariable.name}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full md:flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Variable name..."
                />
                <input
                  type="text"
                  value={newVariable.defaultValue}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, defaultValue: e.target.value }))}
                  className="w-full md:flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Default value..."
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addVariable}
                  className="w-full md:w-auto px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-dark-700">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <SafeIcon icon={FiSave} className="w-4 h-4" />
                <span>{prompt ? 'Update' : 'Create'}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromptModal;