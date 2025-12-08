// src/pages/WeeklyPlan.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { fetchWeeklyRecipes } from "../utils/api/weekly";
import "./WeeklyPlan.css";

const DAY_TABS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyPlan() {
  const navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState("Mon");
  const [weeklyRecipes, setWeeklyRecipes] = useState({});

  useEffect(() => {
    const load = async () => {
      const weekly = await fetchWeeklyRecipes();
      setWeeklyRecipes(weekly);
    };
    load();
  }, []);

  const recipes = weeklyRecipes[selectedDay] || [];
  const dateRangeLabel = "2024.12.01 ~ 12.07";

  const handleReset = () => {
    alert("RESET 기능은 추후 추천 로직과 연결될 예정입니다.");
  };

  return (
    <div className="weekly-page">
      {/* 1줄째: 로고 + 날짜 범위 */}
      <div className="weekly-top-row">

        <div className="weekly-logo">
          <span className="weekly-logo-circle" />
          <div className="weekly-logo-text">
            <span>WEEKLY</span>
            <span>PLAN</span>
          </div>
        </div>
        
        <div className="weekly-tabs">
          {DAY_TABS.map((day) => (
            <button
              key={day}
              type="button"
              className={`weekly-tab ${selectedDay === day ? "active" : ""}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      

        {/* RESET */}
        <Button type="primary" onClick={handleReset}>
          RESET
        </Button>

      </div>

      {/* =====  카드 그리드 ===== */}
      <section className="weekly-main">

        <div className="weekly-recipes-grid">
          {recipes.length === 0 && (
            <p className="weekly-empty">
            아직 선택한 요일에 등록된 식단이 없습니다. 
            </p>
        )}

        {recipes.map((r) => (
          <div key={r.id}>
            <div
              className="weekly-recipe-card"
              onClick={() => navigate(`/recipes/${r.id}`)}
            >
              <div className="weekly-recipe-image-wrap">
                <img src={r.image_url} alt={r.title} />
              </div>

              <div className="weekly-recipe-info">
                <div className="weekly-recipe-title">{r.title}</div>
              </div>

              <div className="weekly-recipe-tags">
                { r.tags?.map((tag) => (
                    <span key={tag} className="tag-badge"> {tag} </span>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      </section>

    </div>
  );
}
