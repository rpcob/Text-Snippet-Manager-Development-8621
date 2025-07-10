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
    {
      id: 'prompt-1',
      title: 'Professional Email Reply',
      content: 'Thank you for your email. I appreciate you reaching out regarding {{subject}}. I will review this and get back to you within {{timeframe}}.\n\nBest regards,\n{{name}}',
      folderId: 'folder-1',
      tags: ['email', 'professional', 'reply'],
      variables: [
        { name: 'subject', defaultValue: 'your inquiry' },
        { name: 'timeframe', defaultValue: '24 hours' },
        { name: 'name', defaultValue: 'Your Name' }
      ],
      shortcut: '/email-reply',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prompt-2',
      title: 'Meeting Follow-up',
      content: 'Hi {{name}},\n\nThank you for taking the time to meet with me today. As discussed, I will {{action}} by {{deadline}}.\n\nPlease let me know if you have any questions.\n\nBest regards,',
      folderId: 'folder-1',
      tags: ['meeting', 'follow-up', 'professional'],
      variables: [
        { name: 'name', defaultValue: 'Team' },
        { name: 'action', defaultValue: 'send the proposal' },
        { name: 'deadline', defaultValue: 'end of week' }
      ],
      shortcut: '/meeting-followup',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prompt-3',
      title: 'Social Media Post',
      content: '🎉 Excited to share {{announcement}}! \n\n{{details}}\n\n#{{hashtag1}} #{{hashtag2}} #{{hashtag3}}',
      folderId: 'folder-2',
      tags: ['social', 'announcement', 'marketing'],
      variables: [
        { name: 'announcement', defaultValue: 'our latest update' },
        { name: 'details', defaultValue: 'More details coming soon...' },
        { name: 'hashtag1', defaultValue: 'exciting' },
        { name: 'hashtag2', defaultValue: 'news' },
        { name: 'hashtag3', defaultValue: 'update' }
      ],
      shortcut: '/social-post',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prompt-4',
      title: 'Content Creation Prompt',
      content: 'Create a comprehensive {{content_type}} about {{topic}}. The content should be:\n\n1. {{requirement1}}\n2. {{requirement2}}\n3. {{requirement3}}\n\nTarget audience: {{audience}}\nTone: {{tone}}\nLength: {{length}}',
      folderId: 'folder-3',
      tags: ['chatgpt', 'content', 'creation'],
      variables: [
        { name: 'content_type', defaultValue: 'blog post' },
        { name: 'topic', defaultValue: 'productivity tips' },
        { name: 'requirement1', defaultValue: 'Well-researched and informative' },
        { name: 'requirement2', defaultValue: 'Engaging and actionable' },
        { name: 'requirement3', defaultValue: 'SEO-optimized' },
        { name: 'audience', defaultValue: 'professionals' },
        { name: 'tone', defaultValue: 'professional yet conversational' },
        { name: 'length', defaultValue: '1500-2000 words' }
      ],
      shortcut: '/content-prompt',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('promptbox-data');
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [currentFolder, setCurrentFolder] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

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
      updatedAt: new Date().toISOString()
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
        prompt.id === id ? { 
          ...prompt, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        } : prompt
      )
    }));
  };

  const deletePrompt = (id) => {
    setData(prev => ({
      ...prev,
      prompts: prev.prompts.filter(prompt => prompt.id !== id)
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'promptbox-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
    addFolder,
    updateFolder,
    deleteFolder,
    addPrompt,
    updatePrompt,
    deletePrompt,
    exportData,
    importData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};