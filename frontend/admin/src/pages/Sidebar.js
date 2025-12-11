// src/pages/Sidebar.js
import { LayoutDashboard, Package, Brain, ChefHat, Settings } from 'lucide-react';
import './Sidebar.css'; // ⭐ 스타일 분리

export function Sidebar({ currentPage, onPageChange }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ingredients', label: 'Ingredients', icon: Package },
    { id: 'ai-logs', label: 'AI Recognition Logs', icon: Brain },
    { id: 'recipes', label: 'Recipes', icon: ChefHat },
    { id: 'system', label: 'System', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">관리자 페이지</h1>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`sidebar-menu-item ${isActive ? 'is-active' : ''}`}
                >
                  <Icon className="sidebar-menu-icon" />
                  <span className="sidebar-menu-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
