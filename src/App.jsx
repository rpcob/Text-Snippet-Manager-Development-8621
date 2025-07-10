import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SearchOverlay from './components/SearchOverlay';
import VariableModal from './components/VariableModal';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { useHotkeys } from 'react-hotkeys-hook';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [variableModal, setVariableModal] = useState(null);

  useHotkeys('ctrl+k, cmd+k', (e) => {
    e.preventDefault();
    setIsSearchOpen(true);
  });

  useHotkeys('ctrl+b, cmd+b', (e) => {
    e.preventDefault();
    setIsSidebarOpen(!isSidebarOpen);
  });

  const handleCopyWithVariables = (prompt) => {
    if (prompt.variables && prompt.variables.length > 0) {
      setVariableModal({
        prompt,
        onComplete: (filledText) => {
          navigator.clipboard.writeText(filledText);
          setVariableModal(null);
        }
      });
    } else {
      navigator.clipboard.writeText(prompt.content);
    }
  };

  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <div className="app bg-gray-50 dark:bg-dark-900 min-h-screen flex flex-col">
            <Header 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
            
            <div className="flex flex-1 overflow-hidden">
              <motion.div
                initial={false}
                animate={{ 
                  width: isSidebarOpen ? 280 : 0,
                  opacity: isSidebarOpen ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-shrink-0 overflow-hidden"
              >
                <Sidebar isOpen={isSidebarOpen} />
              </motion.div>
              
              <main className="flex-1 overflow-hidden">
                <Routes>
                  <Route 
                    path="/*" 
                    element={
                      <MainContent 
                        onCopyWithVariables={handleCopyWithVariables}
                      />
                    } 
                  />
                </Routes>
              </main>
            </div>

            <SearchOverlay 
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              onCopyWithVariables={handleCopyWithVariables}
            />

            {variableModal && (
              <VariableModal
                prompt={variableModal.prompt}
                onComplete={variableModal.onComplete}
                onClose={() => setVariableModal(null)}
              />
            )}
          </div>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;