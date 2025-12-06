import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchRecipesByIngredients } from "../utils/api/recipe";
import { fetchIngredients } from "../utils/api/ingredients";
// import { IngredientsListPage  } from "./ListPage.js";
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
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // 오른쪽 태그(✕) 클릭 시 선택 해제
  const removeSelected = (item) => {
    setSelected((prev) => prev.filter((i) => i !== item));
  };

  // const handleSearch = async () => {
  //   try {
  //     const data = await searchRecipesByIngredients(selected);
  //     setResults(data); 
  //   } catch (error) {
  //     //  에러 처리
  //   } finally {
  //   }
  // };

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);

    console.log("=== 레시피 검색 시작 ===");
    console.log(`[STATE] Loading: true, HasSearched: true, 선택된 재료 수: ${selected.length}`);

    try {
        const apiResponse = await searchRecipesByIngredients(selected);
        
        let rawDataToProcess = [];

        // if (apiResponse && apiResponse.recipe && typeof apiResponse.recipe === 'object') {
        //     rawDataToProcess = [apiResponse.recipe]; 
        //     console.log("[DEBUG] 응답 객체에서 단일 레시피 추출 완료.");
            
        // } else 
        if (Array.isArray(apiResponse)) {
            rawDataToProcess = apiResponse;
            console.log(`[DEBUG 2] 응답이 이미 배열입니다. 처리 항목 수: ${apiResponse.length}`);
            
        } else {
             console.warn("[DEBUG] API 응답이 예상치 못한 형태입니다. 빈 목록으로 처리합니다.", apiResponse);
             setResults([]);
             setLoading(false); 
             return;
        }

        console.log(`[API] 처리할 레시피 항목 수: ${rawDataToProcess.length}`);
        

/* 데이터 가공 */        
        const processedRecipes = rawDataToProcess.map(recipe => {
            try {
                return {
                    ...recipe,
                    priority_used_ingredients: recipe.priority_used_ingredients 
                        ? JSON.parse(recipe.priority_used_ingredients) 
                        : [],
                    other_ingredients: recipe.other_ingredients 
                        ? JSON.parse(recipe.other_ingredients) 
                        : [],
                    recipe_steps: recipe.recipe_steps 
                        ? JSON.parse(recipe.recipe_steps) 
                        : [],
                    recipe_tips: recipe.recipe_tips 
                        ? JSON.parse(recipe.recipe_tips) 
                        : [],
                    
                    
                    title: recipe.recipe_title || recipe.title || '제목 없음', 
                        tags: recipe.priority_used_ingredients 
                            ? JSON.parse(recipe.priority_used_ingredients).slice(0, 3) 
                            : []
                };
            } catch (e) {
                console.error("레시피 JSON 파싱 오류:", e, recipe);
                return null;
            }
        })
        .filter(recipe => recipe !== null);
        setResults(processedRecipes); 
        console.log(`[STATE] 최종 결과 설정 완료. 표시될 레시피 수: ${processedRecipes.length}`);
        
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
      <section className="saved-hero">
        <h1>RECIPE</h1>
        <p>레시피 / 찾기</p>
      </section>

      {/*전체 2컬럼 레이아웃 */}
      <div className="search-layout">
        {/* === 왼쪽 : 식재료 + 추천 레시피 === */}
        <div className="search-left">
          {/* 상단 텍스트 */}
          <div className="search-top-row">
            <h2 className="search-main-title">식재료를 선택하세요</h2>
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
          </section>
        </div>

        {/* === 오른쪽 : 정렬 / 검색 / 레시피 찾기 / 선택된 재료 === */}
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
  );
}
