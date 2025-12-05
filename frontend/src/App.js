// src/App.js
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import searchIcon from "./images/search.png";
import notiIcon from "./images/noti.png";
import IngredientsPage from "./IngredientsPage";
import RecipePage from "./RecipePage";
import WastePage from "./WastePage";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import RecipeSaved from "./pages/RecipeSaved";
import RecipeSearch from "./pages/RecipeSearch";
import RecipeDetail from "./pages/RecipeDetail";
import WeeklyPlan from "./pages/WeeklyPlan";
import ExpireAlert from "./pages/ExpireAlert";


// 메인(홈) 화면 컴포넌트
function Home() {
  return (
    <div className="app">
      <header className="header">
        {/* 로고 클릭 시 항상 홈("/")으로 */}
        <Link to="/" className="logo-link">
          FreshLens
        </Link>

        <nav className="nav" style={{ fontSize: "60px" }}>
          <Link to="/ingredients">식재료</Link>
          <Link to="/recipe">레시피</Link>
          <Link to="/weekly">주간식단</Link>
          <Link to="/waste">폐기량</Link>
        </nav>

        <div className="header-icons">
          <button className="icon-btn" aria-label="검색">
            <img
              src={searchIcon}
              alt="검색"
              style={{ width: 28, height: 28 }}
            />
          </button>

          <button className="icon-btn" aria-label="알림 설정">
            <img
              src={notiIcon}
              alt="알림 설정"
              style={{ width: 28, height: 28 }}
            />
          </button>
        </div>
      </header>

      {/* 검정 아이콘(브로콜리, 사과, 바나나, 토마토, 파프리카) */}
      <div className="deco deco1" />
      <div className="deco deco2" />
      <div className="deco deco3" />
      <div className="deco deco4" />
      <div className="deco deco5" />
    </div>
  );
}

// 라우팅만 담당하는 App 컴포넌트
function App() {
  return (
    <Routes>
      {/* 메인 페이지: / */}
      <Route path="/" element={<Home />} />

      {/* 식재료 페이지: /ingredients */}
      <Route path="/ingredients" element={<IngredientsPage />} />

      {/* 레시피 페이지: /recipe */}
      <Route path="/recipe" element={<RecipePage />} />

      {/* 폐기량 페이지: /waste */}
      <Route path="/waste" element={<WastePage />} />

      {/* 주간식단 페이지는 나중에 추가할 예정이면
          <Route path="/weekly" element={<WeeklyPage />} /> 이런 식으로 추가 */}


      <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} /> 
      <Route path="/recipes/saved" element={<RecipeSaved />} />
      <Route path="/recipes/search" element={<RecipeSearch />} />
      <Route path="/recipes/:id" element={<RecipeDetail />} />
      <Route path="/weekly-plan" element={<WeeklyPlan />} />
      <Route path="/alerts" element={<ExpireAlert />} />
      </Route>
    </Routes>
  );
}

export default App;
