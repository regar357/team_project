import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const HOME_MENU_ITEMS = [

  { id: "ing-add", label: "식재료 등록", icon: "📷", path: "/ingredients" },
  { id: "ing-list", label: "식재료 목록", icon: "📋", path: "/list" },
  { id: "rec-find", label: "레시피 찾기", icon: "👩‍🍳", path: "/recipes/search" },
  { id: "weekly", label: "주간 식단", icon: "📅", path: "/weekly-plan" },
  { id: "waste", label: "폐기물 정리", icon: "📊", path: "/waste" },
  { id: "alerts", label: "유통기한 알림", icon: "🔔", path: "/alerts" },
];

const Home = () => {
  return (
    <div className="home">
      <main className="home-main">
        <div className="home-menu-grid">
          {HOME_MENU_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="home-menu-card"
            >
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
