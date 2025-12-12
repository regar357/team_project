import React, { useEffect, useState } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import { fetchRecipeById, toggleRecipeSave, getSavedRecipeIds } from "../utils/api/recipe";
import "./RecipeDetail.css";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  /* LOAD RECIPE DETAILS */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      let targetRecipe = null;
      // 전달받은 레시피 데이터(state)가 있는지 확인
      const transmittedData = location.state?.recipeData;
      if (transmittedData) {
        console.log("State를 통해 레시피 데이터 수신 완료.");
        targetRecipe = transmittedData;
       } else {
         console.log(`[Detail] DB에서 레시피 ID ${id} 조회 시작.`);
            try {
                targetRecipe = await fetchRecipeById(id); 
            } catch (err) {
                setError("저장된 레시피 정보를 불러오지 못했습니다.");
            }
    }
      
      if (targetRecipe) {
          setRecipe(targetRecipe);
          
          //  저장 상태 확인 
          // 'TEMP-'로 시작하는 ID는 추천 레시피에서 온 임시 ID로 간주
          const isTemporary = String(targetRecipe.id).startsWith("TEMP-");
          
          if (!isTemporary) {
              // 저장된 레시피만 ID를 기반으로 isSaved를 체크
              const recipeIdForCheck = Number(targetRecipe.id); 
              const savedIds = getSavedRecipeIds(); 
              setIsSaved(savedIds.includes(recipeIdForCheck));
          } else {
              // 임시 ID를 가진 레시피는 초기 상태를 '저장 안 됨'으로 설정
              setIsSaved(false);
          }
      } else {
          console.error("[Detail] 레시피 데이터를 찾을 수 없습니다.");
          setError("레시피 데이터를 찾을 수 없습니다.");
      }

      setLoading(false);
    };
    load();
  }, [id, location.state]); // 의존성 배열에 id와 location.state 포함


  const handleToggleSave  = async () => {
    if (!recipe) return;
    const next = await toggleRecipeSave(recipe, isSaved);
    setIsSaved(next);
  };

  if (loading) return <div className="detail-page">불러오는 중...</div>;
  if (error || !recipe)
    return (
      <div className="detail-page">
        {error || "레시피 데이터를 찾을 수 없습니다."}
      </div>
    );

  const allIngredients = [
    ...(recipe.priority_used_ingredients || []),
    ...(recipe.other_ingredients || []),
  ];

  return (
    <div className="detail-page">
      <button className="back-link" onClick={() => navigate(-1)}>
        ← 목록으로
      </button>

      <div className="detail-grid">
        {/* ===== LEFT COLUMN ===== */}
        <div className="left-column">
          <div className="detail-box left-box">
          {/* 이미지 */}
          <div className="detail-image-wrap">
            <img
              src={recipe.image_url}  alt={recipe.title} className="detail-image" />
          </div>

          {/* 제목 + 하트 */}
          <div className="detail-title-row">
            <h1 className="detail-title">{recipe.title}</h1>
            <button
              className={`heart-btn ${isSaved ? "saved" : ""}`}
              onClick={handleToggleSave}
            >
              {isSaved ? "♥" : "♡"}
            </button>
          </div>

          {/* 소개 */}
          <p className="detail-description">{recipe.description}</p>

          {/* 인분 */}
          <p className="detail-meta">🍽 {recipe.servings} 인분 기준</p>

          <div className="divider" />

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
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="right-column">
          <div className="detail-box">
            <h2 className="detail-section-title">식재료</h2>
            <div className="log-divider" />

            <ul className="detail-list">
              {/*  합쳐진 식재료 목록 사용 */}
              {allIngredients.length === 0 && (
                <li>필요한 식재료가 없습니다.</li>
              )}
              {allIngredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="detail-box">
            <h2 className="detail-section-title">조리 순서</h2>
            <div className="log-divider" />
            <div className="detail-steps">
              {recipe.steps?.map((step, idx) => (
                <div key={idx} className="step-item">
                  <span className="step-number">{idx + 1}</span>
                  <span className="step-text">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
