// src/layouts/SidebarMenu.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SidebarMenu.css";

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
     { id: "ing-add",   label: "식재료 등록",   icon: "📷", path: "/ingredients" },
    { id: "ing-list",  label: "식재료 목록",   icon: "📋", path: "/List" },
    { id: "rec-saved", label: "저장된 레시피", icon: "💾", path: "/recipes/saved" },
    { id: "rec-find",  label: "레시피 찾기",   icon: "🍳", path: "/recipes/search" },
    { id: "weekly", label: "주간식단", icon: "📅", path: "/weekly-plan" },
    { id: "waste", label: "폐기량 시각화", icon: "📊", path: "/waste" },
    { id: "alerts", label: "유통기한 알림", icon: "🔔", path: "/alerts" },
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
