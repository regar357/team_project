// src/layouts/AppHeader.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import "./AppHeader.css";

const AppHeader = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <>
      {/* 상단 헤더 */}
      <header className="app-header">
        <button
          type="button"
          className="header-icon-btn"
          onClick={toggleSidebar}
          aria-label="메뉴 열기"
        >
          {/* 햄버거 아이콘 */}
          <span className="icon-menu" />
        </button>

        <div
          className="header-logo"
          onClick={() => navigate("/")}
        >
          FreshLens
        </div>

        <div className="header-right">
          <button
            type="button"
            className="header-icon-btn"
            aria-label="검색"
            onClick={() => navigate("/search")}
          >
            <span className="icon-search" />
          </button>
          <button
            type="button"
            className="header-icon-btn"
            aria-label="알림"
            onClick={() => navigate("/alerts")}
          >
            <span className="icon-bell" />
          </button>
        </div>
      </header>

      {/* 왼쪽 사이드바 */}
      <SidebarMenu open={isSidebarOpen} onClose={toggleSidebar} />
    </>
  );
};

export default AppHeader;
