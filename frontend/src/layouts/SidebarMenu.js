// src/layouts/SidebarMenu.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SidebarMenu.css";

const SidebarMenu = ({ open, onClose }) => {
  const navigate = useNavigate();

  // 어떤 섹션이 펼쳐져 있는지
  const [openSection, setOpenSection] = useState(null); // "ingredient" | "recipe" | null

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  // 공통 네비게이션 헬퍼
  const go = (path) => {
    navigate(path);
    onClose(); // 이동 후 사이드바 닫기
  };

  return (
    <>
      {/* 반투명 오버레이 */}
      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={onClose}
      />

      {/* 실제 사이드바 */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* 상단 색 배경 + 햄버거 */}
        <div className="sidebar-top">
          <button
            type="button"
            className="sidebar-menu-btn"
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            <span className="sidebar-menu-icon" />
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* 식재료 섹션 */}
          <div
            className="sidebar-item"
            onMouseEnter={() => setOpenSection("ingredient")}
          >
            <button
              type="button"
              className="sidebar-main-btn"
              onClick={() => toggleSection("ingredient")}
            >
              <span>식재료</span>
              <span className="sidebar-arrow">
                {openSection === "ingredient" ? "▾" : "▸"}
              </span>
            </button>
          </div>
          {openSection === "ingredient" && (
            <div className="sidebar-sub-list">
              <button
                type="button"
                className="sidebar-sub-btn"
                onClick={() => go("/ingredients/new")} // 경로는 프로젝트에 맞게
              >
                식재료 등록
              </button>
              <button
                type="button"
                className="sidebar-sub-btn"
                onClick={() => go("/ingredients")}
              >
                식재료 목록
              </button>
            </div>
          )}

          {/* 레시피 섹션 */}
          <div
            className="sidebar-item"
            onMouseEnter={() => setOpenSection("recipe")}
          >
            <button
              type="button"
              className="sidebar-main-btn"
              onClick={() => toggleSection("recipe")}
            >
              <span>레시피</span>
              <span className="sidebar-arrow">
                {openSection === "recipe" ? "▾" : "▸"}
              </span>
            </button>
          </div>
          {openSection === "recipe" && (
            <div className="sidebar-sub-list">
              <button
                type="button"
                className="sidebar-sub-btn"
                onClick={() => go("/recipes/saved")}
              >
                레시피 보관함
              </button>
              <button
                type="button"
                className="sidebar-sub-btn"
                onClick={() => go("/recipes/search")}
              >
                레시피 찾기
              </button>
            </div>
          )}

          {/* 주간식단 */}
          <div className="sidebar-item">
            <button
              type="button"
              className="sidebar-main-btn"
              onClick={() => go("/weekly-plan")}
            >
              <span>주간식단</span>
            </button>
          </div>

          {/* 폐기량 */}
          <div className="sidebar-item">
            <button
              type="button"
              className="sidebar-main-btn"
              onClick={() => go("/waste")}
            >
              <span>폐기량</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default SidebarMenu;
