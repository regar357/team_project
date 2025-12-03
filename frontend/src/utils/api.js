// 시연용 더미 데이터 
const dummySavedRecipes = [
  {
    id: 1,
    name: "Egg Scramble",
    category: "양식",
    imageUrl: "/images/egg.png",
    createdAt: "2025-02-01"
  },
  {
    id: 2,
    name: "Hamburger",
    category: "양식",
    imageUrl: "/images/burger.png",
    createdAt: "2025-02-02"
  },
  {
    id: 3,
    name: "Fresh Salad",
    category: "디저트",
    imageUrl: "/images/salad.png",
    createdAt: "2025-01-30"
  },
  {
    id: 4,
    name: "Egg Scramble",
    category: "양식",
    imageUrl: "/images/egg.png",
    createdAt: "2025-02-01"
  },
  {
    id: 4,
    name: "Egg Scramble",
    category: "양식",
    imageUrl: "/images/egg.png",
    createdAt: "2025-02-01",
    ingredients: ["계란", "우유", "소금"]
  },
  {
    id: 5,
    name: "Hamburger",
    category: "양식",
    imageUrl: "/images/burger.png",
    createdAt: "2025-02-02",
    ingredients: ["빵", "소고기", "토마토", "양상추", "치즈"]
  },
];

// 시연용: 저장된 레시피 목록 
export async function fetchSavedRecipes() {
  await new Promise((r) => setTimeout(r, 300));
  return dummySavedRecipes;
}

// 시연용: 레시피 상세 조회 (id로 찾기)
export async function fetchRecipeDetail(id) {
  await new Promise((r) => setTimeout(r, 200));
  return dummySavedRecipes.find((item) => item.id === Number(id));
}

// 시연용: 레시피 삭제하기
export async function deleteRecipe(id) {
  await new Promise((r) => setTimeout(r, 200));
  return true; // 성공했다고 가정
}

// //백엔드 연동 후 
// export async function fetchSavedRecipes() {
//   const res = await fetch("/api/recipes/saved");
//   return res.json();
// }
