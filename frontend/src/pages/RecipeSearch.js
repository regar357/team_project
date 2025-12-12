import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  searchRecipesByIngredients,
  safeJsonParseOrSplit,
} from "../utils/api/recipe";
import { fetchIngredients } from "../utils/api/ingredients";
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

  // DB에서 식재료 목록 가져오기
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
    // 유통기한 임박순 (가장 빠른 날짜 먼저)
    if (sortMode === "expire") {
      if (!a.expireAt) return 1;
      if (!b.expireAt) return -1;
      return new Date(a.expireAt) - new Date(b.expireAt);
    }
    // 등록순: id 기준 오름차순 (food_id)
    return a.id - b.id;
  });

  const filteredIngredients = sortedIngredients.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // 재료 선택 토글
  const toggleIngredient = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  // 오른쪽 태그(✕) 클릭 시 선택 해제
  const removeSelected = (name) => {
    setSelected((prev) => prev.filter((i) => i !== name));
  };

  const parseMaybeArray = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === "string") {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
      return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);

    console.log("=== 레시피 검색 시작 ===");
    console.log(
      `[STATE] Loading: true, HasSearched: true, 선택된 재료 수: ${selected.length}`
    );

    try {
      const apiResponse = await searchRecipesByIngredients(selected);

      let rawDataToProcess = [];

      if (Array.isArray(apiResponse)) {
        rawDataToProcess = apiResponse;
        console.log(
          `[DEBUG 2] 응답이 이미 배열입니다. 처리 항목 수: ${apiResponse.length}`
        );
      } else {
        console.warn(
          "[DEBUG] API 응답이 예상치 못한 형태입니다. 빈 목록으로 처리합니다.",
          apiResponse
        );
        setResults([]);
        setLoading(false);
        return;
      }

      console.log(`[API] 처리할 레시피 항목 수: ${rawDataToProcess.length}`);

/* 데이터 가공 */        
        const processedRecipes = rawDataToProcess.map((recipe,index) => {
            try {
              const priorityIngredients = recipe.priority_used_ingredients;
              const otherIngredients = recipe.other_ingredients;
              return {
                id: recipe.recipe_id || recipe.id || `TEMP-${index}`,
                ...recipe,
                priority_used_ingredients: priorityIngredients,
                other_ingredients: otherIngredients,
                title: recipe.recipe_title || recipe.title || '제목 없음', 
                tags: priorityIngredients.slice(0, 3)
              };
            }catch (e) {
                console.error("레시피 JSON 파싱 오류:", e, recipe);
                return null;
            }
        })
        .filter((recipe) => recipe !== null);
      setResults(processedRecipes);
      console.log(
        `[STATE] 최종 결과 설정 완료. 표시될 레시피 수: ${processedRecipes.length}`
      );
    } catch (error) {
      console.error("레시피 검색/생성 오류:", error);
      alert(`레시피 검색 중 오류가 발생했습니다: ${error.message}`);
      setResults([]);
    } finally {
      setLoading(false);
      console.log("=== 레시피 검색 종료 [Loading: false] ===");
    }
  };

  return (
    <div className="search-page">
      <div className="search-page-inner">
        <section className="saved-hero">
          <h1>RECIPE</h1>
          <p>레시피 / 찾기</p>
        </section>

        {/*전체 2컬럼 레이아웃 */}
        <div className="search-layout">
          {/* === 왼쪽 : 식재료 + 추천 레시피 === */}

          <div className="search-left">
            <section className="ingredient-card">
              {/* 상단 텍스트 */}
              <div className="search-top-row">
                <h2 className="search-main-title">식재료를 선택하세요</h2>

                <div className="side-sort-row">
                  <button
                    className={`side-sort-tab ${
                      sortMode === "name" ? "active" : ""
                    }`}
                    onClick={() => setSortMode("name")}
                  >
                    이름순
                  </button>

                  <button
                    className={`side-sort-tab ${
                      sortMode === "created" ? "active" : ""
                    }`}
                    onClick={() => setSortMode("created")}
                  >
                    등록순
                  </button>

                  <button
                    className={`side-sort-tab ${
                      sortMode === "expire" ? "active" : ""
                    }`}
                    onClick={() => setSortMode("expire")}
                  >
                    임박순
                  </button>
                </div>
              </div>
              {/* 재료 클라우드 */}
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
            </section>

            {/* 추천 레시피 영역 */}
            <section className="recommend-section">
              <div
                className={`recommend-box ${
                  results.length > 0 ? "no-header" : ""
                }`}
              >
                {/* 카드가 없을 때만 제목 표시 */}
                {results.length === 0 && (
                  <h3 className="recommend-title">추천 레시피</h3>
                )}
                {/* 검색 전 / 결과 없음 */}
                {!hasSearched && results.length === 0 && (
                  <div className="recommend-placeholder">
                    <p className="recommend-helper">
                      왼쪽에서 식재료를 선택한 뒤
                      <br />
                      <b>“레시피 찾기”</b> 버튼을 눌러보세요.
                    </p>
                  </div>
                )}

                {hasSearched && results.length === 0 && !loading && (
                  <div className="recommend-placeholder">
                    <p className="recommend-empty">
                      선택한 재료로 추천할 수 있는 레시피가 없어요.
                    </p>
                  </div>
                )}

                {/* 카드가 있을 때는 카드만 보여줌 */}

                {results.length > 0 && (
                  <div className="recommend-row">
                    {results.map((recipe) => (
                      <Card key={recipe.id}>
                        <div
                          className="recommend-card"
                          onClick={() =>
                            navigate(`/recipes/${recipe.id}`, {
                              state: { recipeData: recipe },
                            })
                          }
                        >
                          <div className="recommend-img-wrap">
                            <img
                              src={recipe.image_url}
                              alt={recipe.title}
                              className="recommend-img"
                            />
                          </div>
                          <div className="recommend-info">
                            <div className="recommend-name">{recipe.title}</div>
                            <div className="recommend-meta">
                              {recipe.tags &&
                                recipe.tags.map((tag) => (
                                  <span key={tag} className="tag-badge">
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* === 오른쪽 : 검색 / 레시피 찾기 / 선택된 재료 === */}
          <aside className="search-side-panel">
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
                  {name} ✕
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
