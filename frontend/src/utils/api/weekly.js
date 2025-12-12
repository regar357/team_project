// src/api/weekly.js

// 요일별 주간 식단용 레시피 카드 더미 데이터
export const WEEKLY_RECIPES = {
  Mon: [
    {
      id: 1,
      title: "토마토 파스타",
      tags: ["파스타", "초간단"],
      image_url: "/images/pasta.jpg",
    },
    {
      id: 2,
      title: "Egg scramble",
      tags: ["다이어트", "고단백","양식"],
      image_url: "/images/egg.png",
    },
    {
      id: 3,
      title: "햄버거",
      tags: ["초간단"],
      image_url: "/images/burger.png",
    },
    {
      id: 4,
      title: "Egg scramble",
      tags: ["다이어트", "고단백"],
      image_url: "/images/egg.png",
    },
    {
      id: 5,
      title: "토마토 파스타",
      tags: ["파스타", "초간단"],
      image_url: "/images/burger.png",
    },
    {
      id: 6,
      title: "Egg scramble",
      tags: ["다이어트", "고단백", "양식"],
      image_url: "/images/egg.png",
    },
  ],
  Tue: [],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
  Sun: [],
};

// 주간 식단 레시피 가져오기
export async function fetchWeeklyRecipes() {
  await new Promise((r) => setTimeout(r, 150)); // 시연용 딜레이
  return WEEKLY_RECIPES;
}
