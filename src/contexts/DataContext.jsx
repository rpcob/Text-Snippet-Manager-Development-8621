import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const defaultData = {
  folders: [
    {
      id: 'favorites',
      name: 'Favorites',
      color: '#f59e0b',
      icon: '⭐',
      parentId: null,
      children: [],
      isSystem: true
    },
    {
      id: 'folder-1',
      name: 'Email Templates',
      color: '#3b82f6',
      icon: '📧',
      parentId: null,
      children: []
    },
    {
      id: 'folder-2',
      name: 'Social Media',
      color: '#10b981',
      icon: '📱',
      parentId: null,
      children: []
    },
    {
      id: 'folder-3',
      name: 'ChatGPT Prompts',
      color: '#8b5cf6',
      icon: '🤖',
      parentId: null,
      children: []
    },
    {
      id: 'folder-4',
      name: 'Quick Links',
      color: '#f59e0b',
      icon: '🔗',
      parentId: null,
      children: []
    }
  ],
  prompts: [
    // ... existing prompts with added favorite field
    {
      id: 'prompt-1',
      title: 'Professional Email Reply',
      content: 'Thank you for your email. I appreciate you reaching out regarding {{subject}}. I will review this and get back to you within {{timeframe}}.\n\nBest regards,\n{{name}}',
      folderId: 'folder-1',
      tags: ['email', 'professional', 'reply'],
      variables: [
        { name: 'subject', defaultValue: 'your inquiry', isEditable: true },
        { name: 'timeframe', defaultValue: '24 hours', isEditable: true },
        { name: 'name', defaultValue: 'Your Name', isEditable: true }
      ],
      shortcut: '/email-reply',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: false
    }
    // ... other prompts
  ]
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('promptbox-data');
    return saved ? JSON.parse(saved) : defaultData;
  });
  const [currentFolder, setCurrentFolder] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [sortType, setSortType] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    localStorage.setItem('promptbox-data', JSON.stringify(data));
  }, [data]);

  const addFolder = (folder) => {
    const newFolder = {
      ...folder,
      id: `folder-${Date.now()}`,
      children: []
    };
    setData(prev => ({
      ...prev,
      folders: [...prev.folders, newFolder]
    }));
    return newFolder;
  };

  const updateFolder = (id, updates) => {
    setData(prev => ({
      ...prev,
      folders: prev.folders.map(folder => 
        folder.id === id ? { ...folder, ...updates } : folder
      )
    }));
  };

  const deleteFolder = (id) => {
    const folder = data.folders.find(f => f.id === id);
    if (folder?.isSystem) return; // Prevent deletion of system folders
    
    setData(prev => ({
      ...prev,
      folders: prev.folders.filter(folder => folder.id !== id),
      prompts: prev.prompts.filter(prompt => prompt.folderId !== id)
    }));
  };

  const addPrompt = (prompt) => {
    const newPrompt = {
      ...prompt,
      id: `prompt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: false
    };
    setData(prev => ({
      ...prev,
      prompts: [...prev.prompts, newPrompt]
    }));
    return newPrompt;
  };

  const updatePrompt = (id, updates) => {
    setData(prev => ({
      ...prev,
      prompts: prev.prompts.map(prompt => 
        prompt.id === id
          ? {
              ...prompt,
              ...updates,
              updatedAt: new Date().toISOString(),
              // If the prompt is favorited and in favorites folder, keep it there
              folderId: updates.favorite ? 'favorites' : updates.folderId
            }
          : prompt
      )
    }));
  };

  const deletePrompt = (id) => {
    setData(prev => ({
      ...prev,
      prompts: prev.prompts.filter(prompt => prompt.id !== id)
    }));
  };

  const toggleFavorite = (promptId) => {
    setData(prev => ({
      ...prev,
      prompts: prev.prompts.map(prompt => 
        prompt.id === promptId
          ? {
              ...prompt,
              favorite: !prompt.favorite,
              folderId: !prompt.favorite ? 'favorites' : prompt.folderId
            }
          : prompt
      )
    }));
  };

  const updateVariableDefault = (promptId, variableName, newDefault) => {
    setData(prev => ({
      ...prev,
      prompts: prev.prompts.map(prompt => 
        prompt.id === promptId
          ? {
              ...prompt,
              variables: prompt.variables.map(v => 
                v.name === variableName ? { ...v, defaultValue: newDefault } : v
              )
            }
          : prompt
      )
    }));
  };

  const getSortedItems = (items) => {
    return [...items].sort((a, b) => {
      let compareResult = 0;
      switch (sortType) {
        case 'name':
          compareResult = (a.title || a.name).localeCompare(b.title || b.name);
          break;
        case 'date':
          compareResult = new Date(b.updatedAt) - new Date(a.updatedAt);
          break;
        case 'favorites':
          compareResult = (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
          break;
        default:
          compareResult = 0;
      }
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  };

  const clearUserData = () => {
    localStorage.removeItem('promptbox-data');
  };

  const exportData = () => {
    return data;
  };

  const importData = (importedData) => {
    setData(importedData);
  };

  const value = {
    data,
    currentFolder,
    setCurrentFolder,
    selectedPrompt,
    setSelectedPrompt,
    sortType,
    setSortType,
    sortDirection,
    setSortDirection,
    addFolder,
    updateFolder,
    deleteFolder,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    updateVariableDefault,
    getSortedItems,
    clearUserData,
    exportData,
    importData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};