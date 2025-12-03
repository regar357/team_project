import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {   fetchIngredients, searchRecipesByIngredients } from "../utils/api";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import "./RecipeSearch.css";


export default function RecipeSearch() {
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState([]);

  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortMode, setSortMode] = useState("created"); 

  // DB(지금은 더미)에서 식재료 목록 가져오기
  useEffect(() => {
    const load = async () => {
      const data = await fetchIngredients();
      setIngredients(data);
    };
    load();
  }, []);

  // sortMode에 따라 정렬된 식재료 목록 만들기
  const sortedIngredients = [...ingredients].sort((a, b) => {
    if (sortMode === "name") {
      return a.name.localeCompare(b.name, "ko-KR");
    }
    if (sortMode === "expire") {
      // 유통기한 임박순 (가장 빠른 날짜 먼저)
      return new Date(a.expireAt) - new Date(b.expireAt);
    }
    // 등록순: id 기준 오름차순 (food_id)
    return a.id - b.id;
  });

  const filteredIngredients = sortedIngredients.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );


  // 재료 선택 토글
  const toggleIngredient = (item) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  // 오른쪽 태그(✕) 클릭 시 선택 해제
  const removeSelected = (item) => {
    setSelected((prev) => prev.filter((i) => i !== item));
  };

  // 레시피 찾기 버튼 클릭
  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    const data = await searchRecipesByIngredients(selected);
    setResults(data);
    setLoading(false);
    
  };

  return (
    <div className="search-page">
      {/* 상단 텍스트 */}
      <div className="search-top-row">
        <h2 className="search-main-title">식재료를 선택하세요</h2>
      </div>

      {/* 재료 클라우드 + 오른쪽 패널 */}
      <div className="ingredient-area">
        {/* 왼쪽:재료 버튼들 */}
        <div className="ingredient-cloud">
          {filteredIngredients.map((item) => {
            const isActive = selected.includes(item.name);
            return (
              <button
                key={item.id ?? item.name}
                type="button"
                className={`ingredient-pill ${isActive ? "active" : ""}`}
                onClick={() => toggleIngredient(item.name)}
              >
                {item.name}
              </button>
            );
          })}

          {filteredIngredients.length === 0 && (
            <div className="no-ingredient">
              해당 이름의 식재료가 없습니다.
            </div>
          )}
        </div>

        {/* 오른쪽: 정렬/검색/레시피찾기/태그 */}
        <aside className="search-side-panel">
          {/* 정렬 탭 */}
          <div className="side-sort-row">
            <button
              className={`side-sort-tab ${sortMode === "name" ? "active" : ""}`}
              onClick={() => setSortMode("name")}
            >
              이름순
            </button>

            <button
              className={`side-sort-tab ${sortMode === "created" ? "active" : ""}`}
              onClick={() => setSortMode("created")}
            >
              등록순
            </button>

            <button
              className={`side-sort-tab ${sortMode === "expire" ? "active" : ""}`}
            onClick={() => setSortMode("expire")}
            >
              임박순
            </button>
          </div>

          {/* SEARCH 입력 */}
          <div className="side-search-row">
            <input
              className="side-search-input"
              placeholder="식재료 검색"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const exact = ingredients.find(
                    (item) => item.name === searchText
                  );
                  if (exact) {
                  toggleIngredient(exact.name);
                  }
                }
              }}
            />
            <span className="side-search-icon">🔍</span>
          </div>

          {/* 레시피 찾기 버튼 */}
          <div className="side-search-button">
            <Button
              full
              onClick={handleSearch}
              disabled={selected.length === 0 || loading}
            >
              {loading ? "검색 중..." : "레시피 찾기"}
            </Button>
          </div>

          {/* 선택된 재료 태그 목록 */}
          <div className="side-tags">
            {selected.length === 0 && (
              <span className="side-tag-placeholder">
                선택된 재료가 없습니다.
              </span>
            )}

            {selected.map((name) => (
              <button
                key={name}
                type="button"
                className="side-tag-chip"
                onClick={() => removeSelected(name)}
              >
                {name}  ✕
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* 추천 레시피 영역 */}
      <section className="recommend-section">
        <h3 className="recommend-title">추천 레시피</h3>

        {!hasSearched && (
          <p className="recommend-helper">
            왼쪽에서 식재료를 선택한 뒤
            <br />
            <b>“레시피 찾기”</b> 버튼을 눌러보세요.
          </p>
        )}

        {hasSearched && results.length === 0 && !loading && (
          <p className="recommend-empty">
            선택한 재료로 추천할 수 있는 레시피가 없어요.
          </p>
        )}

        <div className="recommend-row">
          {results.map((recipe) => (
            <Card key={recipe.id}>
              <div
                className="recommend-card"
                onClick={() => navigate(`/recipes/${recipe.id}`)}
              >
                <div className="recommend-img-wrap">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="recommend-img"
                  />
                </div>
                <div className="recommend-info">
                  <div className="recommend-name">{recipe.name}</div>
                  <div className="recommend-meta">
                    {recipe.time} · {recipe.servings}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
