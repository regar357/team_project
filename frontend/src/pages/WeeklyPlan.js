// src/pages/WeeklyPlan.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchIngredients } from "../utils/api/ingredients";
// import { generateWeeklyPlan } from "../utils/api/weekly";
import { fetchWeeklyRecipes } from "../utils/api/weekly";
import "./WeeklyPlan.css";

const DAY_TABS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyPlan() {
  const navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState("Mon");
  const [weeklyRecipes, setWeeklyRecipes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const weekly = await fetchWeeklyRecipes();
      setWeeklyRecipes(weekly);
      setLoading(false);
    };
    load();
  }, []);

  //   // 식재료 가져와서 AI 모델로 주간 식단 생성
  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       // 현재 보유 식재료 목록 가져오기
  //       const ingredients = await fetchIngredients();
  //       const ingredientNames = ingredients.map((i) => i.name);

  //       console.log("[WeeklyPlan] 가져온 식재료:", ingredientNames);

  //       // AI 모델에 주간 식단 생성 요청
  //       const weekly = await generateWeeklyPlan(ingredientNames);

  //       console.log("[WeeklyPlan] AI 추천 결과:", weekly);

  //       setWeeklyRecipes(weekly);
  //     } catch (err) {
  //       console.error("주간 식단 불러오기 실패:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   load();
  // }, []);

  const recipes = weeklyRecipes[selectedDay] || [];
  const displayedRecipes = recipes.slice(0, 3);


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
      </div>

      {/* =====  카드 그리드 ===== */}
      <section className="weekly-main">
          {loading && ( <p className="weekly-loading">AI가 주간 식단을 생성 중입니다...</p> )}
          
          { !loading && displayedRecipes.length === 0 && (
            <p className="weekly-empty">
            아직 선택한 요일에 등록된 식단이 없습니다. 
            </p>
        )}
        
        <div className="weekly-recipes-grid">

        {displayedRecipes.map((r) => (
          <div key={r.id}>
            <div
              className="weekly-recipe-card"
              onClick={() => navigate(`/recipes/${r.id}`,{ state: { recipeData: r }})}
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
