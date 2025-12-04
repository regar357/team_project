// src/api/weekly.js

// 요일별 레시피 카드 더미 데이터
export const WEEKLY_RECIPES = {
  Mon: [
    {
      id: 1,
      title: "Egg scramble",
      time: "10 min",
      image_url: "/images/egg-scramble.jpg",
    },
    {
      id: 2,
      title: "Steak",
      time: "15 min",
      image_url: "/images/steak.jpg",
    },
    {
      id: 3,
      title: "Stew",
      time: "20 min",
      image_url: "/images/stew.jpg",
    },
    {
      id: 4,
      title: "Egg scramble",
      time: "10 min",
      image_url: "/images/egg-scramble.jpg",
    },
    {
      id: 5,
      title: "Steak",
      time: "15 min",
      image_url: "/images/steak.jpg",
    },
    {
      id: 6,
      title: "Stew",
      time: "20 min",
      image_url: "/images/stew.jpg",
    },
  ],
  Tue: [],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
  Sun: [],
};

// // 오른쪽 영수증에 쓸 식재료 리스트 (원하면 ingredients.js 재사용도 가능)
// export const WEEKLY_INGREDIENTS = [
//   { name: "사과", dday: "D-1" },
//   { name: "바나나", dday: "D-1" },
//   { name: "시금치", dday: "D-2" },
//   { name: "당근", dday: "D-4" },
//   { name: "계란", dday: "D-5" },
//   { name: "우유", dday: "D-8" },
//   { name: "치즈", dday: "D-10" },
// ];

// 더미 API
export function fetchWeeklyRecipes() {
  return Promise.resolve(WEEKLY_RECIPES);
}

export function fetchWeeklyIngredients() {
  return Promise.resolve(WEEKLY_INGREDIENTS);
}
