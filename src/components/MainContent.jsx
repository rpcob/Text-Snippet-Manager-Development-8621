import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../contexts/DataContext';
import PromptCard from './PromptCard';
import PromptModal from './PromptModal';
import PromptDetail from './PromptDetail';

const { FiPlus, FiGrid, FiList, FiSearch, FiFilter } = FiIcons;

const MainContent = ({ onCopyWithVariables, isMobile, viewMode }) => {
  const { data, currentFolder, selectedPrompt, setSelectedPrompt, getSortedItems } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const currentPrompts = currentFolder
    ? currentFolder.id === 'favorites'
      ? data.prompts.filter(p => p.favorite)
      : data.prompts.filter(p => p.folderId === currentFolder.id)
    : data.prompts;

  const filteredPrompts = currentPrompts.filter(prompt => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = !filterTag || prompt.tags.includes(filterTag);
    return matchesSearch && matchesFilter;
  });

  const sortedPrompts = getSortedItems(filteredPrompts);
  const allTags = [...new Set(data.prompts.flatMap(p => p.tags))];

  const handleCreatePrompt = () => {
    setEditingPrompt(null);
    setIsModalOpen(true);
  };

  const handleEditPrompt = (prompt) => {
    setEditingPrompt(prompt);
    setIsModalOpen(true);
  };

  // New class for mobile list view container
  const containerClasses = isMobile && viewMode === 'list'
    ? 'space-y-1' // Tighter spacing for mobile list
    : viewMode === 'grid' && !isMobile
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
    : 'space-y-3 md:space-y-4';

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {currentFolder ? currentFolder.name : 'All Prompts'}
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {sortedPrompts.length} prompts
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreatePrompt}
              className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm md:text-base"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span className="hidden sm:inline">New Prompt</span>
              <span className="sm:hidden">New</span>
            </motion.button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3 md:space-y-0 md:flex md:items-center md:space-x-4">
            <div className="flex-1 relative">
              <SafeIcon
                icon={FiSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-6 ${isMobile ? 'pb-20' : ''}`}>
          <AnimatePresence>
            {sortedPrompts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiSearch} className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No prompts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm md:text-base">
                  {searchTerm || filterTag
                    ? 'Try adjusting your search or filter'
                    : 'Get started by creating your first prompt'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreatePrompt}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm md:text-base"
                >
                  Create Prompt
                </motion.button>
              </motion.div>
            ) : (
              <div className={containerClasses}>
                {sortedPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    viewMode={isMobile ? viewMode : viewMode}
                    onEdit={() => handleEditPrompt(prompt)}
                    onCopy={() => onCopyWithVariables(prompt)}
                    onSelect={() => setSelectedPrompt(prompt)}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Panel - Hidden on mobile */}
      {!isMobile && (
        <AnimatePresence>
          {selectedPrompt && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 border-l border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800"
            >
              <PromptDetail
                prompt={selectedPrompt}
                onClose={() => setSelectedPrompt(null)}
                onEdit={() => handleEditPrompt(selectedPrompt)}
                onCopy={() => onCopyWithVariables(selectedPrompt)}
                isMobile={isMobile}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <PromptModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPrompt(null);
        }}
        prompt={editingPrompt}
        folderId={currentFolder?.id}
        isMobile={isMobile}
      />
    </div>
  );
};

export default MainContent;