import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useData } from '../contexts/DataContext';

const { FiX, FiCopy } = FiIcons;

const VariableModal = ({ prompt, onComplete, onClose, isMobile }) => {
  const { updateVariableDefault } = useData();
  const [variables, setVariables] = useState(() => {
    const initialVars = {};
    prompt.variables.forEach(variable => {
      initialVars[variable.name] = variable.defaultValue;
    });
    return initialVars;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let filledContent = prompt.content;
    
    Object.entries(variables).forEach(([name, value]) => {
      const regex = new RegExp(`\\{\\{${name}\\}\\}`, 'g');
      filledContent = filledContent.replace(regex, value);
    });
    
    onComplete(filledContent);
  };

  const handleVariableChange = (name, value, isDefault = false) => {
    if (isDefault) {
      updateVariableDefault(prompt.id, name, value);
    } else {
      setVariables(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

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
            isMobile ? 'max-w-full' : 'max-w-lg'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 md:p-6 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                Fill Variables
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
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
              Fill in the variables below to customize your prompt
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
            {prompt.variables.map((variable) => (
              <div key={variable.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="font-mono text-primary-600 dark:text-primary-400">
                    {`{{${variable.name}}}`}
                  </span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={variables[variable.name]}
                    onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={variable.defaultValue}
                  />
                  {variable.isEditable && (
                    <input
                      type="text"
                      value={variable.defaultValue}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value, true)}
                      className="flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Default value"
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Preview */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview
              </label>
              <div className="p-3 md:p-4 bg-gray-50 dark:bg-dark-700 rounded-lg border max-h-48 overflow-y-auto">
                <pre className="text-xs md:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                  {prompt.variables.reduce((content, variable) => {
                    const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g');
                    return content.replace(regex, variables[variable.name] || variable.defaultValue);
                  }, prompt.content)}
                </pre>
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
                <SafeIcon icon={FiCopy} className="w-4 h-4" />
                <span>Copy to Clipboard</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VariableModal;