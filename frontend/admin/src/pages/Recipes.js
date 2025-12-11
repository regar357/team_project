// src/pages/Recipes.js
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Recipes.css';

const RECIPES_STORAGE_KEY = 'adminRecipes';
const RECIPES_API_URL = 'http://localhost:3001/api/admin/recipes';

// const INITIAL_RECIPES = [
//   {
//     id: 1,
//     name: '토마토 파스타',
//     ingredients: ['토마토', '면', '올리브유', '마늘'],
//     status: '공개',
//     servings: '2인분',         
//     created_at: '2025-01-10',  
//   },
//   {
//     id: 2,
//     name: '된장찌개',
//     ingredients: ['된장', '두부', '감자', '애호박', '양파'],
//     status: '공개',
//     servings: '3인분',
//     created_at: '2025-01-08',
//   },
//   {
//     id: 3,
//     name: '카레라이스',
//     ingredients: ['카레루', '감자', '당근', '양파', '고기'],
//     status: '공개',
//     servings: '4인분',
//     created_at: '2025-01-05',
//   },
//   {
//     id: 4,
//     name: '김치볶음밥',
//     ingredients: ['김치', '밥', '돼지고기', '참기름'],
//     status: '비공개',
//     servings: '1인분',
//     created_at: '2025-01-02',
//   },
// ];

export function Recipes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

   // 로드: localStorage → API 순서로 불러오기
  useEffect(() => {
    // localStorage에서 먼저 채우기
    try {
      const saved = localStorage.getItem(RECIPES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecipes(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load recipes from localStorage', err);
    }

    //  서버에서 최신 데이터 가져오기
    const fetchFromServer = async () => {
      try {
        setLoading(true);
        const res = await fetch(RECIPES_API_URL);
        if (!res.ok) throw new Error('API 응답 오류');

        // 🔸 백엔드에서
        // [{ recipe_id, recipe_title, priority_used_ingredients, other_ingredients, servings, created_at, ... }, ...]
        const data = await res.json();

        if (Array.isArray(data)) {
          const normalized = data.map((r) => {
            const priority =
              Array.isArray(r.priority_used_ingredients)
                ? r.priority_used_ingredients
                : [];
            const others = Array.isArray(r.other_ingredients)
              ? r.other_ingredients
              : [];

            return {
              recipe_id: r.recipe_id,
              recipe_title: r.recipe_title,
              servings: r.servings,
              created_at: r.created_at,
              ingredients: [...priority, ...others],
            };
          });

          setRecipes(normalized);
          localStorage.setItem(
            RECIPES_STORAGE_KEY,
            JSON.stringify(normalized)
          );
        }
      } catch (err) {
        console.error('Failed to fetch recipes from API', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFromServer();
  }, []);

        

  //  검색 필터 (레시피명 기준)
  const filteredRecipes = recipes.filter((recipe) =>
    (recipe.recipe_title || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  //   //  레시피 추가
  // const handleAdd = async  () => {
  //   const recipe_title = window.prompt('새 레시피 이름을 입력하세요.');
  //   if (!recipe_title) return;

  //   const servingsInput =
  //     window.prompt('몇 인분인지 숫자로 입력하세요. 예: 2') || '1';
  //   const servings = parseInt(servingsInput, 10);
  //   if (Number.isNaN(servings) || servings <= 0) {
  //     alert('인분 수는 1 이상의 숫자로 입력해주세요.');
  //     return;
  //   }

  //   const ingredientsInput = window.prompt(
  //     '레시피 재료를 쉼표로 구분해서 입력하세요.\n예) 토마토, 양파, 마늘'
  //   );
  //   const ingredients = ingredientsInput
  //     ? ingredientsInput
  //         .split(',')
  //         .map((s) => s.trim())
  //         .filter((s) => s.length > 0)
  //     : [];

    
  //   const payload = {
  //     recipe_title,
  //     servings,
  //     priority_used_ingredients: [],
  //     other_ingredients: ingredients,
  //     // recipe_description, recipe_steps, recipe_tips 등은 지금은 사용 안 함
  //   };
    
  //   try {
  //     const res = await fetch(RECIPES_API_URL, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(payload),
  //     });
  //     if (!res.ok) throw new Error('추가 API 오류');

  //     // 서버에서 생성된 레코드( recipe_id, created_at 포함 )를 돌려준다고 가정
  //     const created = await res.json();

  //     const priority =
  //       Array.isArray(created.priority_used_ingredients)
  //         ? created.priority_used_ingredients
  //         : [];
  //     const others = Array.isArray(created.other_ingredients)
  //       ? created.other_ingredients
  //       : [];

  //     const normalized = {
  //       recipe_id: created.recipe_id,
  //       recipe_title: created.recipe_title,
  //       servings: created.servings,
  //       created_at: created.created_at,
  //       ingredients: [...priority, ...others],
  //     };

  //     setRecipes((prev) => {
  //       const next = [...prev, normalized];
  //       localStorage.setItem(
  //         RECIPES_STORAGE_KEY,
  //         JSON.stringify(next)
  //       );
  //       return next;
  //     });
  //   } catch (err) {
  //     console.error('Failed to add recipe', err);
  //     alert('레시피 추가 중 오류가 발생했습니다.');
  //   }
  // };

  const handleEdit = async(recipe) => {
    const recipe_title =
      window.prompt('레시피 이름 수정', recipe.recipe_title) ||
      recipe.recipe_title;

    const servingsInput =
      window.prompt(
        '몇 인분인지 수정',
        String(recipe.servings ?? '1')
      ) || String(recipe.servings ?? '1');
    const servings = parseInt(servingsInput, 10);
    if (Number.isNaN(servings) || servings <= 0) {
      alert('인분 수는 1 이상의 숫자로 입력해주세요.');
      return;
    }

    const ingredientsInput =
      window.prompt(
        '재료 목록 수정 (쉼표로 구분)',
        (recipe.ingredients || []).join(', ')
      ) || (recipe.ingredients || []).join(', ');
    const ingredients = ingredientsInput
      ? ingredientsInput
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];

    const payload = {
      recipe_title,
      servings,
      priority_used_ingredients: [],
      other_ingredients: ingredients,
    };

    try {
      const res = await fetch(
        `${RECIPES_API_URL}/${recipe.recipe_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error('수정 API 오류');

      setRecipes((prev) => {
        const next = prev.map((r) =>
          r.recipe_id === recipe.recipe_id
            ? {
                ...r,
                recipe_title,
                servings,
                ingredients,
              }
            : r
        );
        localStorage.setItem(
          RECIPES_STORAGE_KEY,
          JSON.stringify(next)
        );
        return next;
      });
    } catch (err) {
      console.error('Failed to update recipe', err);
      alert('레시피 수정 중 오류가 발생했습니다.');
    }
  };

    // 레시피 삭제

  const handleDelete = async (recipe) => {
     if (!window.confirm(`"${recipe.recipe_title}" 레시피를 삭제하시겠습니까?`))
      return;

    try {
      const res = await fetch(
        `${RECIPES_API_URL}/${recipe.recipe_id}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('삭제 API 오류');

      setRecipes((prev) => {
        const next = prev.filter(
          (r) => r.recipe_id !== recipe.recipe_id
        );
        localStorage.setItem(
          RECIPES_STORAGE_KEY,
          JSON.stringify(next)
        );
        return next;
      });
    } catch (err) {
      console.error('Failed to delete recipe', err);
      alert('레시피 삭제 중 오류가 발생했습니다.');
    }
  };

   const handleView = (recipe) => {
    window.alert(
      `레시피: ${recipe.name}\n인분: ${recipe.servings}\n생성일: ${recipe.created_at}\n재료: ${recipe.ingredients.join(
        ', '
      )}`
    );
  };


  return (
    <div className="recipes">
      <div className="recipes-header">
        <h1 className="recipes-title">Recipes</h1>
        <p className="recipes-description">레시피 CRUD</p>
      </div>

      {/* 테이블형 리스트 */}
      <div className="recipes-card">
        <div className="recipes-toolbar">
          <div className="recipes-search-wrapper">
            <Search className="recipes-search-icon" />
            <input
              type="text"
              placeholder="레시피 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="recipes-search-input"
            />
          </div>
          {/* <button className="recipes-add-button" onClick={handleAdd}>
            <Plus className="recipes-add-icon" />
            <span>레시피 추가</span>
          </button> */}
        </div>

        {/* 로딩 메시지 */}
        {loading && (
          <div className="px-6 py-3 text-sm text-gray-500">
            서버에서 레시피 데이터를 불러오는 중입니다...
          </div>
        )}

        <div className="recipes-table-wrapper">
          <table className="recipes-table">
            <thead>
              <tr>
                <th>레시피명</th>
                <th>인분</th>        
                <th>재료 수</th>
                <th>생성일</th>      
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((recipe) => (
                
                <tr key={recipe.recipe_id}>
                  <td className="cell-strong">{recipe.recipe_title}</td>
                  <td className="cell-muted">{recipe.servings}인분</td>
                  <td className="cell-muted">
                    {recipe.ingredients ? recipe.ingredients.length : 0}개
                  </td>
                  <td className="cell-muted">
                    {recipe.created_at ? String(recipe.created_at).replace('T', ' ') : '-'}
                  </td>
                  <td>
                    <div className="recipes-actions">
                      <button className="recipes-action-button view"
                        onClick={() =>
                            window.alert(
                                `"${recipe.recipe_title}" 상세보기는 추후 구현 예정입니다.`
                            )
                        }
                      >
                        <Eye />
                      </button>
                      <button
                        className="recipes-action-button edit"
                        onClick={() => handleEdit(recipe)}
                      >
                        <Edit />
                      </button>
                      <button
                        className="recipes-action-button delete"
                        onClick={() => handleDelete(recipe)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRecipes.length === 0 && (
                <tr>
                  <td colSpan={5} className="recipes-empty">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 카드형 표시 */}
      <div className="recipes-cards-grid">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="recipes-card-item">
            <div className="recipes-card-header">
              <h3 className="recipes-card-title">{recipe.recipe_title}</h3>
            </div>

            <div className="recipes-card-meta">
              <div className="recipes-card-meta-row">
                <span className="meta-label">인분:</span>
                <span className="meta-value">{recipe.servings}</span>
              </div>

              <div className="recipes-card-meta-row">
                <span className="meta-label">재료:</span>
                <span className="meta-value">
                  {recipe.ingredients ? recipe.ingredients.length : 0}개
                </span>
              </div>

              <div className="recipes-card-meta-row">
                <span className="meta-label">생성일:</span>
                <span className="meta-value">{recipe.created_at ? String(recipe.created_at).replace('T', ' '): '-'}</span>
              </div>
            </div>

            <div className="recipes-card-buttons">
              <button
                className="recipes-card-button secondary"
                onClick={() => handleView(recipe)}
              >
                상세보기
              </button>
              <button
                className="recipes-card-button primary"
                onClick={() => handleEdit(recipe)}
              >
                수정
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
