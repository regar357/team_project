// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <Link to="/" className="home-logo-link">
          FreshLens
        </Link>
      </header>

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
            <div className="home-menu-title">식재료 등록하기</div>
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
          
        </div>
      </main>
    </div>
  );
};

export default Home;
