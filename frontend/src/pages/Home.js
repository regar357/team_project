// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const HOME_MENU_ITEMS = [
    { id: "ing-add", label: "식재료 등록", icon: "📷", path: "/ingredients" },
    { id: "ing-list", label: "식재료 목록", icon: "📋", path: "/list" }, 
    { id: "rec-saved", label: "레시피 보관함", icon: "💾", path: "/recipes/saved" },
    { id: "rec-find", label: "레시피 찾기", icon: "🍳", path: "/recipes/search" },
    { id: "weekly", label: "주간식단", icon: "📅", path: "/weekly-plan" },
    { id: "waste", label: "폐기량 시각화", icon: "📊", path: "/waste" },
];

const Home = () => {
  return (
    <div className="home">
      <main className="home-main">
        <div className="home-menu-grid">
          <Link to="/recipes/search" className="home-menu-card">
            <div className="home-menu-icon">👩‍🍳</div>
            <div className="home-menu-title">레시피 찾기</div>
          </Link>

          <Link to="/list" className="home-menu-card">
            <div className="home-menu-icon">📆</div>
            <div className="home-menu-title">식재료 목록</div>
          </Link>

          <Link to="/ingredients" className="home-menu-card">
            <div className="home-menu-icon">✨</div>
            <div className="home-menu-title">식재료 등록</div>
          </Link>

          <Link to="/weekly-plan" className="home-menu-card">
            <div className="home-menu-icon">ℹ️</div>
            <div className="home-menu-title">주간 식단</div>
          </Link>

          <Link to="/alerts" className="home-menu-card">
            <div className="home-menu-icon">🔔</div>
            <div className="home-menu-title">유통기한 알림</div>
          </Link>

          <Link to="/waste" className="home-menu-card">
            <div className="home-menu-icon">🗑️</div>
            <div className="home-menu-title">폐기물 정리</div>
          </Link>
          
          {HOME_MENU_ITEMS.map((item) => (
            <Link key={item.id} to={item.path} className="home-menu-card">
              <div className="home-menu-icon">{item.icon}</div>
              <div className="home-menu-title">{item.label}</div>
            </Link>
            ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
