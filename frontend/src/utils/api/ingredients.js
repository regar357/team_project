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
];

// 전체 목록
export async function fetchIngredients() {
  await new Promise((r) => setTimeout(r, 200)); // 시연용 딜레이
  return INGREDIENTS;
}
// export function fetchIngredients() {
//   return fetchIngredientList();
// }

// 이름으로 검색 (레시피 찾기 search)
export function searchIngredientsByName(keyword) {
  const lower = keyword.trim().toLowerCase();
  if (!lower) return Promise.resolve(INGREDIENTS);

  const filtered = INGREDIENTS.filter((item) =>
    item.name.toLowerCase().includes(lower)
  );
  return Promise.resolve(filtered);
}
