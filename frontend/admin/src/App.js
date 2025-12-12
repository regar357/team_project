// src/App.js
import { useState } from 'react';
import { Sidebar } from './pages/Sidebar.js';
import { Dashboard } from './pages/Dashboard.js';
import { Ingredients } from './pages/Ingredients.js';
import { AIRecognitionLogs } from './pages/AIRecognitionLogs.js';

import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'ingredients':
        return <Ingredients />;
      case 'ai-logs':
        return <AIRecognitionLogs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
}
