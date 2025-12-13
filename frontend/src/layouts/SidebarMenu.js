// src/layouts/SidebarMenu.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SidebarMenu.css";

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "rec-find",  label: "레시피 찾기",   icon: "🍳", path: "/recipes/search" },
    { id: "ing-list",  label: "식재료 목록",   icon: "📋", path: "/List" },
    { id: "ing-add",   label: "식재료 등록",   icon: "📷", path: "/ingredients" },
    { id: "weekly", label: "주간식단", icon: "📅", path: "/weekly-plan" },
    { id: "alerts", label: "유통기한 알림", icon: "🔔", path: "/alerts" },
    { id: "waste", label: "폐기물 정리", icon: "📊", path: "/waste" },
    { id: "rec-saved", label: "저장된 레시피", icon: "💾", path: "/recipes/saved" },
  ];

  const handleClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="sidebar">
      <div
        className="sidebar-logo"
        onClick={() => navigate("/")}
      >
        FreshLens
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
            onClick={() => handleClick(item.path)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarMenu;
