import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRecipeById } from "../utils/api/recipe";
import "./RecipeDetail.css";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  /* -------------------------
      LOAD RECIPE DETAILS
  -------------------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRecipeById(id);
        setRecipe(data);
      } catch {
        setError("레시피를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  /* -------------------------
         CHECK SAVED
  -------------------------- */
  useEffect(() => {
    if (!recipe) return;
    const raw = localStorage.getItem("savedRecipes");
    if (!raw) return;

    try {
      const arr = JSON.parse(raw);
      if (arr.includes(recipe.id)) setIsSaved(true);
    } catch {}
  }, [recipe]);

  /* -------------------------
       SAVE / UNSAVE TOGGLE
  -------------------------- */
  const toggleSave = () => {
    const raw = localStorage.getItem("savedRecipes");
    let arr = [];

    try {
      arr = raw ? JSON.parse(raw) : [];
    } catch {
      arr = [];
    }

    if (isSaved) {
      arr = arr.filter((rid) => rid !== recipe.id);
    } else {
      arr.push(recipe.id);
    }

    localStorage.setItem("savedRecipes", JSON.stringify(arr));
    setIsSaved(!isSaved);
  };

  if (loading) return <div className="detail-page">불러오는 중...</div>;
  if (error || !recipe) return <div className="detail-page">{error}</div>;

  return (
    <div className="detail-page">
      <button className="back-link" onClick={() => navigate(-1)}>
        ← 목록으로
      </button>

      <div className="detail-grid">

        {/* ===== LEFT COLUMN ===== */}
        <div className="left-column">

          {/* 이미지 */}
          <div className="detail-image-wrap">
            <img src={recipe.image_url} alt={recipe.title} className="detail-image" />
          </div>

          {/* 제목 + 하트 */}
          <div className="detail-title-row">
            <h1 className="detail-title">{recipe.title}</h1>
            <button
              className={`heart-btn ${isSaved ? "saved" : ""}`}
              onClick={toggleSave}
            >
              {isSaved ? "♥" : "♡"}
            </button>
          </div>

          {/* 소개 */}
          <p className="detail-description">{recipe.description}</p>

          {/* 인분 */}
          <p className="detail-meta">🍽 {recipe.servings} 인분 기준</p>
          
          {/* TIP */}
          <div className="tip-section">
            <h2 className="tip-title">TIP</h2>
            <ul className="tip-list">
              {recipe.tips?.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="right-column">

          <div className="detail-box">
            <h2 className="detail-section-title">냉장고 속 식재료</h2>
            <ul className="detail-list">
              {recipe.priority_used_ingredients?.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="detail-box">
            <h2 className="detail-section-title">추가 필요한 재료</h2>
            <ul className="detail-list">
              {recipe.other_ingredients?.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="detail-box">
            <h2 className="detail-section-title">조리 순서</h2>
            <ol className="detail-steps">
              {recipe.steps?.map((step, idx) => (
                <li key={idx}>
                  <span className="step-number">{idx + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          

        </div>
      </div>
    </div>
  );
}
