// src/App.js
import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="logo">FreshLens</div>

        <nav className="nav">
          <a href="#ingredients">식재료</a>
          <a href="#recipe">레시피</a>
          <a href="#weekly">주간식단</a>
          <a href="#waste">폐기량</a>
        </nav>

        <div className="header-icons">
          <button className="icon-btn" aria-label="검색">
            🔍
          </button>
          <button className="icon-btn" aria-label="알림">
            🔔
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
