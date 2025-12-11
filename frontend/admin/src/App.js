// src/App.js
import { useState } from 'react';
import { Sidebar } from './pages/Sidebar.js';
import { Dashboard } from './pages/Dashboard.js';
import { Ingredients } from './pages/Ingredients.js';
import { AIRecognitionLogs } from './pages/AIRecognitionLogs.js';
import { Recipes } from './pages/Recipes.js';
import { System } from './pages/System.js';
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
      case 'recipes':
        return <Recipes />;
      case 'system':
        return <System />;
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
