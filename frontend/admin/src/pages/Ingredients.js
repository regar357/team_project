// src/pages/Ingredients.js
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Ingredients.css';

const INGREDIENTS_STORAGE_KEY = 'adminIngredients';
const INGREDIENTS_API_URL = 'http://localhost:3001/api/admin/ingredients';

// // DB 구조에 맞춘 샘플 데이터
// const INITIAL_INGREDIENTS = [
//   {
//     food_id: 1,
//     food_name: '우유',
//     food_category: '유제품',
//     food_Ex: 13, // 13일
//   },
//   {
//     food_id: 2,
//     food_name: '달걀',
//     food_category: '계란',
//     food_Ex: 30,
//   },
//   {
//     food_id: 3,
//     food_name: '토마토',
//     food_category: '채소',
//     food_Ex: 7,
//   },
//   {
//     food_id: 4,
//     food_name: '소고기',
//     food_category: '육류',
//     food_Ex: 3,
//   },
// ];

export function Ingredients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  
  //  localStorage , API
  useEffect(() => {
    //  localStorage에서 불러오기
    try {
      const saved = localStorage.getItem(INGREDIENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setIngredients(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load ingredients from localStorage', err);
    }

    // 서버에서 최신 데이터 가져오기
    const fetchFromServer = async () => {
      try {
        setLoading(true);
        const res = await fetch(INGREDIENTS_API_URL);
        if (!res.ok) throw new Error('API 응답 오류');

        const data = await res.json(); // [{ food_id, food_name, food_category, food_Ex }, ...]
        setIngredients(data);

        // localStorage 최신화
        localStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.error('Failed to fetch ingredients from API', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFromServer();
  }, []);

  // 이름으로 검색 (food_name 기준)
  const filteredIngredients = ingredients.filter((item) =>
    item.food_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const handleAdd = async () => {
  //   const food_name = window.prompt('새 식재료 이름을 입력하세요.');
  //   if (!food_name) return;

  //   const food_category =
  //     window.prompt('카테고리를 입력하세요. (예: 채소, 육류, 유제품 등)') || '기타';

  //   const foodExInput = window.prompt(
  //     '기본 유통기한(일)을 숫자로 입력하세요. 예: 7'
  //   );
  //   if (!foodExInput) return;
  //   const food_Ex = parseInt(foodExInput, 10);
  //   if (Number.isNaN(food_Ex)) {
  //     window.alert('유통기한은 숫자로 입력해주세요.');
  //     return;
  //   }

  //   const payload = { food_name, food_category, food_Ex };

  //   try {
  //     // 서버에 먼저 저장 (DB에 INSERT)
  //     const res = await fetch(INGREDIENTS_API_URL, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(payload),
  //     });
  //     if (!res.ok) throw new Error('추가 API 오류');

  //     const created = await res.json(); // { food_id, food_name, ... }

  //     // 프론트 state 업데이트
  //     setIngredients((prev) => {
  //       const next = [...prev, created];
  //       localStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(next));
  //       return next;
  //     });
  //   } catch (err) {
  //     console.error('Failed to add ingredient', err);
  //     alert('식재료 추가 중 오류가 발생했습니다.');
  //   }
  // };

  const handleEdit = async (item) => {
    const food_name =
      window.prompt('식재료 이름 수정', item.food_name) || item.food_name;

    const food_category =
      window.prompt('카테고리 수정', item.food_category) || item.food_category;

    const foodExInput =
      window.prompt('기본 유통기한(일) 수정', String(item.food_Ex) ) || String(item.food_Ex);

    const food_Ex = parseInt(foodExInput, 10);
    if (Number.isNaN(food_Ex)) {
      window.alert('유통기한은 숫자로 입력해주세요.');
      return;
    }

    const payload = { food_name, food_category, food_Ex };


    try {
      const res = await fetch(`${INGREDIENTS_API_URL}/${item.food_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('수정 API 오류');

      setIngredients((prev) => {
        const next = prev.map((ing) =>
          ing.food_id === item.food_id
            ? { ...ing, food_name, food_category, food_Ex }
            : ing
        );
        localStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    } catch (err) {
      console.error('Failed to update ingredient', err);
      alert('식재료 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDelete =  async (item) => {
    if (!window.confirm(`"${item.food_name}" 식재료를 삭제하시겠습니까?`)) return;
   try {
      const res = await fetch(`${INGREDIENTS_API_URL}/${item.food_id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('삭제 API 오류');

      setIngredients((prev) => {
        const next = prev.filter((ing) => ing.food_id !== item.food_id);
        localStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    } catch (err) {
      console.error('Failed to delete ingredient', err);
      alert('식재료 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="ingredients">
      {/* 상단 헤더 */}
      <div className="ingredients-header">
        <h1 className="ingredients-title">Ingredients</h1>
        <p className="ingredients-description">
          식재료 기본 정보 및 유통기한(일) 관리
        </p>
      </div>

      {/* 카드 래퍼 */}
      <div className="ingredients-card">
        {/* 검색 + 추가 버튼 영역 */}
        <div className="ingredients-toolbar">
          <div className="ingredients-search-wrapper">
            <Search className="ingredients-search-icon" />
            <input
              type="text"
              placeholder="식재료 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ingredients-search-input"
            />
          </div>
          {/* <button className="ingredients-add-button" onClick={handleAdd}>
            <Plus className="ingredients-add-icon" />
            <span>식재료 추가</span>
          </button> */}
        </div>

        {loading && (
          <div className="ingredients-loading">서버에서 데이터 불러오는 중...</div>
        )}

        {/* 테이블 영역 */}
        <div className="ingredients-table-wrapper">
          <table className="ingredients-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>카테고리</th>
                <th>기본 유통기한(일)</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.map((item) => (
                <tr key={item.food_id}>
                  <td>{item.food_name}</td>
                  <td className="cell-muted">{item.food_category}</td>
                  <td className="cell-muted">{item.food_Ex}일</td>
                  <td>
                    <div className="ingredients-actions">
                      <button
                        className="ingredients-action-button edit"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="ingredients-action-icon" />
                      </button>
                      <button
                        className="ingredients-action-button delete"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="ingredients-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredIngredients.length === 0 && !loading &&(
                <tr>
                  <td colSpan={4} className="ingredients-empty">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
