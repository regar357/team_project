// src/api/weekly.js

// 요일별 주간 식단용 레시피 카드 더미 데이터
export const WEEKLY_RECIPES = {
  Mon: [
  {
    id: 1,
    title: "토마토 파스타",
    // image_url: "/images/pasta.jpg",   
    priority_used_ingredients: ["계란", "버터", "우유"],
    other_ingredients : ["올리브유", "마늘", "소금", "후추"],
    servings: 2,
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
    // image_url: "/images/egg.png",
    priority_used_ingredients: ["계란", "버터", "우유", "소금"],
    other_ingredients: ["올리브유", "마늘", "소금", "후추"],
    servings: 1,
    steps: [
      "계란을 풀고 우유와 섞습니다.",
      "버터를 두른 팬에 약불로 익힙니다.",
      "살살 저어가며 부드럽게 마무리합니다.",
    ],
    tips: ["불은 세지 않게, 계속 약불로 유지하는 게 포인트예요."],
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

  const processedWeeklyRecipes = {};

  // 요일별로 순회하며 레시피 가공
  for (const day of Object.keys(WEEKLY_RECIPES)) {
      processedWeeklyRecipes[day] = WEEKLY_RECIPES[day].map((recipe,index) => {
          const priorityTags = recipe.priority_used_ingredients || [];

          return {
              id: recipe.recipe_id || recipe.id || `TEMP-${index}`,
              title: recipe.title,
              image_url: recipe.image_url ?? "/images/default_recipe.png",
              tags: priorityTags.slice(0, 3), 
              priority_used_ingredients: priorityTags,
              other_ingredients: recipe.other_ingredients,
              steps: recipe.steps,
              servings: recipe.servings ?? 1,
              tips: recipe.tips,
              
          };
      });
  }
  
  console.log("=== 주간 식단 가공된 더미 데이터 ===");
  console.log(processedWeeklyRecipes);

  return processedWeeklyRecipes;
}


// // src/utils/api/weekly.js

// const BASE_URL = "http://localhost:3001";

// // 주간 식단 자동 생성 (AI 기반)
// export async function generateWeeklyPlan(ingredients) {
//   try {
//     const response = await fetch(`${BASE_URL}/weekly/generate`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ingredients }),
//     });

//     if (!response.ok) {
//       throw new Error("주간 식단 생성 실패");
//     }

//     const data = await response.json();

//     const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//     for (const day of days) {
//       if (!Array.isArray(data[day])) {
//         console.warn(`[weekly] ${day} 데이터가 배열이 아닙니다. 빈 배열로 대체합니다.`);
//         data[day] = [];
//       }

//       // 6개보다 많이 오면 자르기
//       data[day] = data[day].slice(0, 6);
//     }


//     return data;
//   } catch (err) {
//     console.error("[generateWeeklyPlan] 오류:", err);
//     throw err;
//   }
// }

