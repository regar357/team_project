// 식재료 더미 목록
const dummyIngredients = [
  {
    id: 1,
    name: "계란",
    createdAt: "2025-11-01",
    expireAt: "2025-11-05",
  },
  {
    id: 2,
    name: "빵",
    createdAt: "2025-11-02",
    expireAt: "2025-11-04",
  },
  {
    id: 3,
    name: "토마토",
    createdAt: "2025-11-03",
    expireAt: "2025-11-08",
  },
  {
    id: 4,
    name: "양파",
    createdAt: "2025-11-01",
    expireAt: "2025-11-06",
  },
  {
    id: 5,
    name: "감자",
    createdAt: "2025-11-02",
    expireAt: "2025-11-03",
  },
  {
    id: 6,
    name: "치즈",
    createdAt: "2025-11-04",
    expireAt: "2025-11-10",
  },
  {
    id: 7,
    name: "쌀",
    createdAt: "2025-11-01",
    expireAt: "2025-12-01",
  },
  
];

//  식재료 목록 가져오기 (나중에 DB API로 교체)
export async function fetchIngredients() {
  // 실제 백엔드 연결 시
  // const res = await fetch("/api/ingredients");
  // return res.json();

  await new Promise((r) => setTimeout(r, 200)); // 시연용 딜레이
  return dummyIngredients;
}


// 저장 레시피 더미 데이터 
const dummySavedRecipes = [
  {
    id: 1,
    name: "Egg Scramble",
    category: "양식",
    imageUrl: "/images/egg.png",
    createdAt: "2025-02-01",
    servings: "1인분",
    time: "10분",
    ingredients: ["계란 2개", "우유 50ml", "소금", "후추", "버터"],
    steps: [
      "볼에 계란과 우유를 넣고 잘 풀어준다.",
      "중약불로 달군 팬에 버터를 녹인다.",
      "계란물을 넣고 주걱으로 천천히 저어가며 익힌다.",
      "반숙 정도에서 불을 끄고 잔열로 마무리한다.",
    ],
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
  return true; 
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



//  레시피 더미 데이터
const dummySearchRecipes = [
  {
    id: 101,
    name: "토마토 파스타",
    category: "양식",
    time: "20분",
    servings: "2인분",
    imageUrl: "/images/pasta.png",
    ingredients: ["파스타", "토마토", "마늘", "올리브유"],
    steps: [
      "파스타 면을 삶는다.",
      "팬에 올리브유와 마늘을 볶는다.",
      "토마토 소스를 넣고 끓인다.",
      "삶은 면을 넣고 잘 섞어준다.",
    ],
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


const dummyRecipeDetail = {
  id: 1,
  imageUrl: "/images/egg.png",
  title: "토마토 파스타",
  description: "상큼한 토마토 향이 가득한 간단 파스타입니다.",
  priority_used_ingredients: ["토마토", "파스타면", "올리브유"],
  other_ingredients: ["마늘", "소금", "후추"],
  servings: 2,
  steps: [
    "파스타 면을 삶습니다.123456789123456789123456789",
    "올리브유에 마늘을 볶습니다.",
    "토마토 소스를 넣고 끓입니다.",
    "면을 넣고 잘 섞어 마무리합니다."
  ],
  tips: [
    "토마토 대신 로제로 변형해도 맛있어요.",
    "면은 80% 정도만 삶아 소스에서 마저 익히세요."
  ]
};


// 레시피 상세 조회 API
export async function fetchRecipeById(id) {
  await new Promise((r) => setTimeout(r, 150));
  return dummyRecipeDetail; // 실제로는 id
}