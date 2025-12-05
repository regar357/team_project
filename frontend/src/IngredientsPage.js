import React from "react";
import "./IngredientsPage.css";

function IngredientsPage() {
  return (
    <div className="page">

      {/* 가운데 흰색 카드 프레임 */}
      <div className="frame">
        {/* 상단 흰색 헤더 */}
        <header className="topbar">
          {/* 왼쪽 햄버거 메뉴 */}
          <button className="menu-btn" aria-label="메뉴 열기">
            <span />
            <span />
            <span />
          </button>

          {/* 가운데 FreshLens 로고 텍스트 */}
          <div className="topbar-logo">FreshLens</div>

          {/* 오른쪽 검색 / 알림 – 이미지는 네가 로고로 채우면 됨 */}
          <div className="topbar-icons">
            <button
              className="icon-btn search-icon"
              aria-label="검색"
              type="button"
            />
            <button
              className="icon-btn notification-icon"
              aria-label="알림"
              type="button"
            />
          </div>
        </header>

        {/* 오렌지색 INGREDIENTS 영역 */}
        <section className="ingredients-hero">
          <h1 className="ingredients-title">INGREDIENTS</h1>
          <p className="ingredients-subtitle">식재료 / 찾기</p>
        </section>

        {/* 아래 내용 영역 – 지금은 비워둠 */}
        <main className="ingredients-content">
          {/* 나중에 식재료 검색/리스트 내용 넣기 */}
        </main>
      </div>
    </div>
  );
}

export default IngredientsPage;
