// src/api/ingredients.js

// 식재료 더미 데이터 
export const INGREDIENTS = [
  {
    id: 1,
    name: "계란",
    category: "단백질",
    expireAt: "2024-12-02",
    dday: "D-1",
    createdAt: "2024-11-20",
  },
  {
    id: 2,
    name: "빵",
    category: "탄수화물",
    expireAt: "2024-12-05",
    dday: "D-4",
    createdAt: "2024-11-18",
  },
  {
    id: 3,
    name: "토마토",
    category: "채소",
    expireAt: "2024-12-04",
    dday: "D-3",
    createdAt: "2024-11-19",
  },
  {
    id: 4,
    name: "양파",
    category: "채소",
    expireAt: "2024-12-10",
    dday: "D-9",
    createdAt: "2024-11-15",
  },
  {
    id: 5,
    name: "고구마",
    category: "단백질",
    expireAt: "2024-12-02",
    dday: "D-1",
    createdAt: "2024-11-20",
  },
  {
    id: 6,
    name: "올리브유",
    category: "탄수화물",
    expireAt: "2024-12-05",
    dday: "D-4",
    createdAt: "2024-11-18",
  },
  {
    id: 7,
    name: "마늘",
    category: "채소",
    expireAt: "2024-12-04",
    dday: "D-3",
    createdAt: "2024-11-19",
  },
  {
    id: 8,
    name: "우유",
    category: "채소",
    expireAt: "2024-12-10",
    dday: "D-9",
    createdAt: "2024-11-15",
  },
];

// // 전체 목록
// export async function fetchIngredients() {
//   await new Promise((r) => setTimeout(r, 200)); // 시연용 딜레이
//   return INGREDIENTS;
// }
// // export function fetchIngredients() {
// //   return fetchIngredientList();
// // }

// // 이름으로 검색 (레시피 찾기 search)
// export function searchIngredientsByName(keyword) {
//   const lower = keyword.trim().toLowerCase();
//   if (!lower) return Promise.resolve(INGREDIENTS);

//   const filtered = INGREDIENTS.filter((item) =>
//     item.name.toLowerCase().includes(lower)
//   );
//   return Promise.resolve(filtered);
// }


// src/api/ingredients.js

const BASE_URL = "http://localhost:3001";

// 전체 식재료 목록 가져오기
export async function fetchIngredients() {
  try {
    const response = await fetch(`${BASE_URL}/ingredients`);
    if (!response.ok) {
      throw new Error("식재료 목록 불러오기 실패");
    }
    const rows = await response.json();

    // 백엔드 컬럼명을 프론트용 필드로 매핑
    return rows.map((row) => ({
      id: row.food_id,             
      name: row.food_name,         
      expireAt: row.food_Ex,      
    }));
  } catch (error) {
    console.error("[fetchIngredients] 오류:", error);
    throw error;
  }
}

// 식재료 검색 (레시피 찾기 페이지에서 사용)
export async function searchIngredientsByName(keyword) {

  const all = await fetchIngredients();
  const lower = keyword.trim().toLowerCase();
  if (!lower) return all;

  return all.filter((item) =>
    item.name.toLowerCase().includes(lower)
  );
}
