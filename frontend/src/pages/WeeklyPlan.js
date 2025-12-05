// src/pages/WeeklyPlan.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { fetchWeeklyRecipes } from "../utils/api/weekly";
import { fetchIngredients } from "../utils/api/ingredients";
import { fetchRecipeById } from "../utils/api/recipe";
import "./WeeklyPlan.css";

const DAY_TABS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyPlan() {
  const navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState("Mon");
  const [weeklyRecipes, setWeeklyRecipes] = useState({});
  const [ingredientMaster, setIngredientMaster] = useState([]); 
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [displayIngredients, setDisplayIngredients] = useState([]); 

  const [nutritionMode, setNutritionMode] = useState(true);
  const [noMissingMode, setNoMissingMode] = useState(true);

  // 주간 레시피 + 식재료 불러오기 (더미 API)
  useEffect(() => {
    const load = async () => {
      const weekly = await fetchWeeklyRecipes();
      setWeeklyRecipes(weekly);

      const ing = await fetchIngredients();
        setIngredientMaster(ing);
        setDisplayIngredients(ing); 
    };
    load();
  }, []);

  const recipes = weeklyRecipes[selectedDay] || [];

  // 간단한 날짜 범위 라벨 (시연용 텍스트)
  const dateRangeLabel = "2024.12.01 ~ 12.07";


  const handleSelectRecipe = (recipeId) => {
    setSelectedRecipeId((prev) => (prev === recipeId ? null : recipeId));
  };

  // 선택된 레시피가 바뀔 때마다 상세 조회해서 재료 목록 세팅
  useEffect(() => {
    const updateIngredientsFromRecipe = async () => {
      if (!selectedRecipeId) {
        setDisplayIngredients(ingredientMaster);
        return;
      }

      const detail = await fetchRecipeById(selectedRecipeId);
      if (!detail) {
        setDisplayIngredients(ingredientMaster);
        return;
      }

      // 레시피에 정의된 재료 이름 배열
      const names = [
        ...(detail.ingredients || []),
      ];
      const uniqueNames = [...new Set(names)];

      // DB 재료 정보(DDay 등)와 매칭
      const merged = uniqueNames.map((name) => {
        const found = ingredientMaster.find((i) => i.name === name);
        return {
          name,
          dday: found?.dday || found?.expireAt || "",
        };
      });

      setDisplayIngredients(merged);
    };

    updateIngredientsFromRecipe();
  }, [selectedRecipeId, ingredientMaster]);

  const handleGoDetail = () => {
    if (!selectedRecipeId) {
      alert("먼저 레시피 카드를 선택해 주세요.");
      return;
    }
    // 상세페이지 라우트 경로에 맞게 수정해서 사용
    navigate(`/recipes/${selectedRecipeId}`);
  };

  /* RESET 버튼 */
  const handleReset = () => {
    setSelectedRecipeId(null);
    setDisplayIngredients(ingredientMaster);
    alert("RESET 추천 로직/백엔드 붙이면 실제 초기화 기능으로 교체");
  };

  return (
    <div className="weekly-page">
      <div className="weekly-layout">
        {/* ========== 왼쪽 사이드: WEEKLY PLAN + 토글 ========== */}
        <aside className="weekly-sidebar">
          <div className="weekly-logo">
            <span className="weekly-logo-circle" />
            <div className="weekly-logo-text">
              <span>WEEKLY</span>
              <span>PLAN</span>
            </div>
          </div>

          {/* 날짜 범위 + 화살표 */}
          <div className="weekly-date-row">
            <Button type="gray" onClick={() => {}}>  ◀    </Button>
            <span className="weekly-date-label">{dateRangeLabel}</span>
            <Button type="gray" onClick={() => {}}>   ▶   </Button>
          </div>

          {/* 토글 옵션 */}
          <div className="weekly-option">
            <span>영양 균형 모드</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={nutritionMode}
                onChange={() => setNutritionMode((v) => !v)}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="weekly-option">
            <span>재료 없는 레시피 제외</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={noMissingMode}
                onChange={() => setNoMissingMode((v) => !v)}
              />
              <span className="toggle-slider" />
            </label>
          </div>


          <div className="weekly-ingredients">
          <div className="ingredients-note-paper">
            <div className="ingredients-inner">
              <h2 className="ingredients-title">Ingredients</h2>
              <p className="ingredients-subtitle">
                {selectedRecipeId ? "메뉴의 식재료 목록" : "메뉴를 선택해주세요"}
              </p>

              <ul className="ingredients-list">
                {displayIngredients.map((item) => (
                  <li key={item.id}>
                    <span className="ingredients-name">{item.name}</span>
                    <span className="ingredients-dot-line">····</span>
                    <span className="ingredients-dday">
                      {item.dday || ""}

                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="ingredients-footer-btn"
                onClick={handleGoDetail}
              >
                RECIPE
              </button>

            </div>
          </div>
          </div>
        
        </aside>

        {/* ========== 가운데: 요일 탭 + 레시피 카드들 ========== */}
        <section className="weekly-main">
          {/* 요일 탭 + RESET 버튼 */}
          <div className="weekly-tabs-row">
            <div className="weekly-tabs">
              {DAY_TABS.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`weekly-tab ${
                    selectedDay === day ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedDay(day);
                    setSelectedRecipeId(null);
                    setDisplayIngredients(ingredientMaster);
                  }}                
                >
                  {day}
                </button>
              ))}
            </div>
            <Button type="primary" onClick={handleReset}>
              RESET
            </Button>
          </div>

          {/* 레시피 카드 그리드 */}
          <div className="weekly-recipes-grid">
            {recipes.length === 0 && (
              <p className="weekly-empty">
                아직 선택한 요일에 등록된 식단이 없습니다. 나중에 추천 로직을 붙여 채워 넣을 수 있어요.
              </p>
            )}

            {recipes.map((r) => (
              <div key={r.id}> 
                <div
                  className={`weekly-recipe-card ${selectedRecipeId === r.id ? "selected" : ""}`}
                  onClick={() => handleSelectRecipe(r.id)}
                >
                  <div className="weekly-recipe-image-wrap">
                    <img src={r.image_url} alt={r.title} />
                  </div>
                  <div className="weekly-recipe-info">
                    <div className="weekly-recipe-title">{r.title}</div>
                  </div>
                  
                  <div className="weekly-recipe-tags">
                    {r.tags && r.tags.map((tag) => (
                      <span key={tag} className="tag-badge">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
