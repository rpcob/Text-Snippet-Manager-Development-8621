import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../contexts/DataContext';
import Fuse from 'fuse.js';

const { FiSearch, FiX, FiCopy, FiFolder, FiCommand } = FiIcons;

const SearchOverlay = ({ isOpen, onClose, onCopyWithVariables }) => {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const fuse = new Fuse([...data.prompts, ...data.folders], {
    keys: [
      { name: 'title', weight: 0.7 },
      { name: 'name', weight: 0.7 },
      { name: 'content', weight: 0.3 },
      { name: 'tags', weight: 0.5 },
      { name: 'shortcut', weight: 0.6 }
    ],
    threshold: 0.4,
    includeScore: true
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const searchResults = fuse.search(searchTerm);
      setResults(searchResults.map(result => result.item));
      setSelectedIndex(0);
    } else {
      setResults([]);
      setSelectedIndex(0);
    }
  }, [searchTerm]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelectResult(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelectResult = (result) => {
    if (result.title) {
      // It's a prompt
      onCopyWithVariables(result);
    } else {
      // It's a folder - could navigate to it
      console.log('Navigate to folder:', result.name);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200 dark:border-dark-700">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-12 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg focus:outline-none"
                placeholder="Search prompts and folders..."
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiSearch} className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'No results found' : 'Start typing to search...'}
                </p>
              </div>
            ) : (
              <div className="py-2">
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                        : 'hover:bg-gray-50 dark:hover:bg-dark-700'
                    }`}
                    onClick={() => handleSelectResult(result)}
                  >
                    <div className="flex items-center space-x-3">
                      {result.title ? (
                        // Prompt result
                        <>
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                            <SafeIcon icon={FiCommand} className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {result.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {result.content.substring(0, 100)}...
                            </p>
                            {result.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.tags.slice(0, 3).map(tag => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiCopy} className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-400">Copy</span>
                          </div>
                        </>
                      ) : (
                        // Folder result
                        <>
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                            style={{ backgroundColor: result.color }}
                          >
                            {result.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {result.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {data.prompts.filter(p => p.folderId === result.id).length} prompts
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiFolder} className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-400">Folder</span>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-white dark:bg-dark-800 rounded border">↵</kbd>
                  <span>to select</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-white dark:bg-dark-800 rounded border">↑↓</kbd>
                  <span>to navigate</span>
                </span>
              </div>
              <span className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-white dark:bg-dark-800 rounded border">esc</kbd>
                <span>to close</span>
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchOverlay;