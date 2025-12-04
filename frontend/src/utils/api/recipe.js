// src/api/recipes.js

// 레시피 더미 데이터
export const RECIPES = [
  {
    id: 1,
    title: "토마토 파스타",
    image_url: "/images/burger.png",
    category: "양식",
    description: "상큼한 토마토 향이 가득한 간단 파스타입니다.",
    servings: 2,
    priority_used_ingredients: ["토마토", "파스타면", "올리브유"],
    other_ingredients: ["마늘", "소금", "후추"],
    ingredients: ["토마토", "파스타면", "올리브유", "마늘", "소금", "후추"],
    steps: [
      "파스타 면을 삶습니다.",
      "올리브유에 마늘을 볶습니다.",
      "토마토 소스를 넣고 끓입니다.",
      "면을 넣고 잘 섞어 마무리합니다.",
    ],
    tips: [
      "토마토 대신 로제로 변형해도 맛있어요.",
      "면은 80% 정도만 삶아 소스에서 마저 익히세요.",
    ],
  },
  {
    id: 2,
    title: "Egg scramble",
    image_url: "/images/egg.png",
    category: "양식",
    description: "아침으로 먹기 좋은 부드러운 스크램블 에그입니다.",
    servings: 1,
    priority_used_ingredients: ["계란"],
    other_ingredients: ["버터", "우유", "소금"],
    ingredients: ["계란", "버터", "우유", "소금"],
    steps: [
      "계란을 풀고 우유와 섞습니다.",
      "버터를 두른 팬에 약불로 익힙니다.",
      "살살 저어가며 부드럽게 마무리합니다.",
    ],
    tips: ["불은 세지 않게, 계속 약불로 유지하는 게 포인트예요."],
  },
 { id: 3,
    title: "토마토 파스타",
    image_url: "/images/burger.png",
    category: "양식",
    description: "상큼한 토마토 향이 가득한 간단 파스타입니다.",
    servings: 2,
    priority_used_ingredients: ["토마토", "파스타면", "올리브유"],
    other_ingredients: ["마늘", "소금", "후추"],
    ingredients: ["토마토", "파스타면", "올리브유", "마늘", "소금", "후추"],
    steps: [
      "파스타 면을 삶습니다.",
      "올리브유에 마늘을 볶습니다.",
      "토마토 소스를 넣고 끓입니다.",
      "면을 넣고 잘 섞어 마무리합니다.",
    ],
    tips: [
      "토마토 대신 로제로 변형해도 맛있어요.",
      "면은 80% 정도만 삶아 소스에서 마저 익히세요.",
    ]
  },
];

/* 검색용 더미 데이터 */
export const dummySearchRecipes = RECIPES.map((r) => ({
  id: r.id,
  title: r.title,
  ingredients: r.ingredients,
}));

/* 선택한 재료로 레시피 검색 */
export async function searchRecipesByIngredients(selectedIngredients) {
  await new Promise((r) => setTimeout(r, 200));

  if (!selectedIngredients || selectedIngredients.length === 0) {
    return [];
  }

  const lower = selectedIngredients.map((i) => i.toLowerCase());

  const filtered = dummySearchRecipes.filter((recipe) =>
    recipe.ingredients.some((ing) => lower.includes(ing.toLowerCase()))
  );

  // 추천 3개만 리턴
  return filtered.slice(0, 3);
}

/* 전체 레시피 목록 */
export function fetchAllRecipes() {
  return Promise.resolve(RECIPES);
}

/* 레시피 상세 조회  */
export function fetchRecipeById(id) {
  return Promise.resolve(RECIPES.find((r) => r.id === Number(id)) || null);
}
// export function fetchRecipeDetail(id) {
//   return fetchRecipeById(id);
// }

/* localStorage로 저장된 레시피 관리 */
const STORAGE_KEY = "savedRecipes";

export function getSavedRecipeIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setSavedRecipeIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function toggleSaveRecipe(id) {
  const current = getSavedRecipeIds();
  const exists = current.includes(id);
  const next = exists ? current.filter((x) => x !== id) : [...current, id];
  setSavedRecipeIds(next);
  return next;
}

/* 저장된 레시피 목록 */
// export function fetchSavedRecipes() {
//   const ids = getSavedRecipeIds();
//   const list = RECIPES.filter((r) => ids.includes(r.id));
//   return Promise.resolve(list);
// }
export async function fetchSavedRecipes() {
  await new Promise((r) => setTimeout(r, 200));
  return RECIPES;
}


/* 레시피 삭제 */
export async function deleteRecipe(id) {
  await new Promise((r) => setTimeout(r, 150));
  return true; 
}
