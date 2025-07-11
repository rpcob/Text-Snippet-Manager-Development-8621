import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SearchOverlay from './components/SearchOverlay';
import VariableModal from './components/VariableModal';
import MobileBottomNav from './components/MobileBottomNav';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { useHotkeys } from 'react-hotkeys-hook';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed on mobile
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [variableModal, setVariableModal] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true); // Open sidebar on desktop
        setViewMode('grid');
      } else {
        setIsSidebarOpen(false); // Close sidebar on mobile
        setViewMode('list');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useHotkeys('ctrl+k,cmd+k', (e) => {
    e.preventDefault();
    setIsSearchOpen(true);
  });

  useHotkeys('ctrl+b,cmd+b', (e) => {
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

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <div className="app bg-gray-50 dark:bg-dark-900 min-h-screen flex flex-col">
            <Header 
              onToggleSidebar={handleSidebarToggle}
              onOpenSearch={() => setIsSearchOpen(true)}
              isMobile={isMobile}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            
            <div className="flex flex-1 overflow-hidden relative">
              {/* Mobile Sidebar Overlay */}
              {isMobile && isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                  onClick={handleSidebarClose}
                />
              )}

              {/* Sidebar */}
              <motion.div
                initial={false}
                animate={{ 
                  x: isSidebarOpen ? 0 : (isMobile ? -280 : -280),
                  opacity: isSidebarOpen ? 1 : (isMobile ? 1 : 0)
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`${
                  isMobile 
                    ? 'fixed left-0 top-0 h-full z-50 pt-16' 
                    : 'relative'
                } flex-shrink-0 overflow-hidden`}
                style={{ width: isSidebarOpen ? 280 : 0 }}
              >
                <Sidebar 
                  isOpen={isSidebarOpen} 
                  onClose={handleSidebarClose}
                  isMobile={isMobile}
                />
              </motion.div>

              {/* Main Content */}
              <main className="flex-1 overflow-hidden">
                <Routes>
                  <Route 
                    path="/*" 
                    element={
                      <MainContent 
                        onCopyWithVariables={handleCopyWithVariables}
                        isMobile={isMobile}
                        viewMode={viewMode}
                      />
                    } 
                  />
                </Routes>
              </main>
            </div>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
              <MobileBottomNav 
                onOpenSearch={() => setIsSearchOpen(true)}
                onToggleSidebar={handleSidebarToggle}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            )}

            <SearchOverlay 
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              onCopyWithVariables={handleCopyWithVariables}
              isMobile={isMobile}
            />

            {variableModal && (
              <VariableModal
                prompt={variableModal.prompt}
                onComplete={variableModal.onComplete}
                onClose={() => setVariableModal(null)}
                isMobile={isMobile}
              />
            )}
          </div>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;