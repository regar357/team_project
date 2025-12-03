// 시연용 더미 데이터 
const dummySavedRecipes = [
  {
    id: 1,
    name: "Egg Scramble",
    category: "양식",
    imageUrl: "/images/egg.png",
    createdAt: "2025-02-01",
    ingredients: ["계란", "우유", "소금"]

  },
  {
    id: 2,
    name: "Hamburger",
    category: "양식",
    imageUrl: "/images/burger.png",
    createdAt: "2025-02-02",
    ingredients: ["빵", "소고기", "토마토", "양상추", "치즈"]
  },
  {
    id: 3,
    name: "Fresh Salad",
    category: "디저트",
    imageUrl: "/images/salad.png",
    createdAt: "2025-01-30",
    ingredients: ["양상추", "토마토", "양파", "올리브유"]
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
    name: "Egg Scramble",
    category: "양식",
    imageUrl: "/images/egg.png",
    createdAt: "2025-02-01",
    ingredients: ["계란", "우유", "소금"],

  },
  {
    id: 6,
    name: "Hamburger",
    category: "양식",
    imageUrl: "/images/burger.png",
    createdAt: "2025-02-02",
    ingredients: ["빵", "소고기", "토마토", "양상추", "치즈"]
  },
];

// 저장된 레시피 목록 
export async function fetchSavedRecipes() {
  await new Promise((r) => setTimeout(r, 200));
  return dummySavedRecipes;
}

// 레시피 삭제하기
export async function deleteRecipe(id) {
  await new Promise((r) => setTimeout(r, 150));
  return true; // 성공했다고 가정
}
// 레시피 상세 조회 (id로 찾기)
export async function fetchRecipeDetail(id) {
  await new Promise((r) => setTimeout(r, 200));
  return dummySavedRecipes.find((item) => item.id === Number(id));
}

// //백엔드 연동 후 
// export async function fetchSavedRecipes() {
//   const res = await fetch("/api/recipes/saved");
//   return res.json();
// }



// 검색에 쓸 재료 기반 레시피 더미 데이터
const dummySearchRecipes = [
  {
    id: 101,
    name: "토마토 파스타",
    category: "양식",
    time: "20분",
    servings: "2인분",
    imageUrl: "/images/pasta.png",
    ingredients: ["파스타", "토마토", "마늘", "올리브유"],
  },
  {
    id: 102,
    name: "감자튀김",
    category: "기타",
    time: "15분",
    servings: "1인분",
    imageUrl: "/images/fries.png",
    ingredients: ["감자", "소금", "식용유"],
  },
  {
    id: 103,
    name: "오믈렛",
    category: "양식",
    time: "10분",
    servings: "1인분",
    imageUrl: "/images/egg.png",
    ingredients: ["계란", "우유", "치즈"],
  },
  {
    id: 104,
    name: "김치볶음밥",
    category: "한식",
    time: "15분",
    servings: "3인분",
    imageUrl: "/images/kimchi-rice.png",
    ingredients: ["김치", "밥", "계란", "대파"],
  },
];

// 선택한 재료로 레시피 검색 
export async function searchRecipesByIngredients(selectedIngredients) {
  await new Promise((r) => setTimeout(r, 200));

  if (!selectedIngredients || selectedIngredients.length === 0) {
    return [];
  }

  // 재료가 하나라도 겹치는 레시피만 필터
  const lower = selectedIngredients.map((i) => i.toLowerCase());
  const filtered = dummySearchRecipes.filter((recipe) =>
    recipe.ingredients.some((ing) =>
      lower.includes(ing.toLowerCase())
    )
  );

  // "메뉴 3개 정도" → 상위 3개만 리턴
  return filtered.slice(0, 3);
}