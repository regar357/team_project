// src/api/recipes.js

// 레시피 더미 데이터
export const RECIPES = [
  {
    id: 1,
    title: "토마토 파스타",
    image_url: "/images/pasta.jpg",
    category: "양식",
    tags: ["파스타", "초간단"],
    description: "상큼한 토마토 향이 가득한 간단 파스타입니다.",
    servings: 2,
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
    tags: ["다이어트", "고단백", "양식"],
    description: "아침으로 먹기 좋은 부드러운 스크램블 에그입니다.",
    servings: 1,
    ingredients: ["계란", "버터", "우유", "소금"],
    steps: [
      "계란을 풀고 우유와 섞습니다.",
      "버터를 두른 팬에 약불로 익힙니다.",
      "살살 저어가며 부드럽게 마무리합니다.",
    ],
    tips: ["불은 세지 않게, 계속 약불로 유지하는 게 포인트예요."],
  },

];


/* api 연동 */
/* API 레시피 생성 */
export async function searchRecipesByIngredients(selectedIngredients) {
    const API_ENDPOINT = '/recipe/generate'; 

    if (!selectedIngredients || selectedIngredients.length === 0) {
      return [];
    }

    const payload = {
        ingredients: selectedIngredients, 
    };

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload), 
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: '알 수 없는 서버 오류' }));
            throw new Error(errorData.message || `API 호출 실패: ${response.status} 상태`);
        }

        const data = await response.json();
        console.log("=== API 레시피 응답 데이터 (JSON) ===");
        console.log(data);

        if (data && Array.isArray(data.recipes)) {
            return data.recipes;
        }

        if (!Array.isArray(data)) {
            console.warn("API 응답 형식이 배열이 아닙니다. 응답:", data);
            return [];
        }

        return data;

    } catch (error) {
        console.error("레시피 검색/생성 중 오류 발생:", error);
        throw new Error(`레시피 생성 서버 오류: ${error.message}`);
    }
}


/* API 레시피 저장 */
export async function fetchSavedRecipes() {
  const API_ENDPOINT = '/recipe/list'; 
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET', 
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '알 수 없는 서버 오류' }));
        throw new Error(errorData.message || `전체 레시피 목록 조회 실패: ${response.status} 상태`);
    }

    const data = await response.json();
    console.log("=== API 레시피 응답 데이터 (GET /recipe/list) ===");
    console.log(data);

    // const allRecipes = (data && Array.isArray(data.recipes)) ? data.recipes : [];

    // const savedIds = getSavedRecipeIds();
    // const savedRecipes = allRecipes.filter(recipe => savedIds.includes(recipe.id));

    // return savedRecipes;


    /* 테스트 용 */
    const allRecipes = RECIPES; 
    console.log(`[MOCK] 전체 레시피 ${allRecipes.length}개 반환.`);
    return  allRecipes;



  } catch (error) {
      console.error("저장된 레시피 목록 조회 오류:", error);
      return [];
  }
}

/* API 레시피 삭제 */
export async function deleteRecipe(id) {
  const API_ENDPOINT = `/recipe/delete/${id}`; 
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
        console.error(`[DELETE API] 실패: 상태 코드 ${response.status}`);
        const errorData = await response.json().catch(() => ({ message: '알 수 없는 서버 오류' }));
        throw new Error(errorData.message || `레시피 삭제 실패: ${response.status} 상태`);
    }
    
    console.log(`[DELETE API] 성공: 상태 코드 ${response.status}. 로컬 스토리지 ID 제거 시작.`);

    toggleSaveRecipe(id);

    return true; 

  } catch (error) {
    console.error(`레시피 ID ${id} 삭제 오류:`, error);
    throw new Error(`레시피 삭제 서버 오류: ${error.message}`);
  }
}

/* API 레시피 상세 조회 */
export async function fetchRecipeById(id) {
  const API_ENDPOINT = `/recipes/list/${id}`; 

  try {
    const response = await fetch(API_ENDPOINT);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`레시피 ID ${id} 상세 정보 없음 (404)`);
        return null;
      }
      throw new Error(`레시피 상세 조회 실패: ${response.status} 상태`);
    }

    const data = await response.json();
    console.log(`=== API 레시피 상세 응답 데이터 (GET /recipes/list/${id}) ===`);
    console.log(data);
    return data;

  } catch (error) {
    console.error(`레시피 ID ${id} 상세 조회 오류:`, error);
    return RECIPES.find((r) => r.id === Number(id)) || null; 
  }
}









/* 검색용 더미 데이터 */
export const dummySearchRecipes = RECIPES.map((r) => ({
  id: r.id,
  title: r.title,
  image_url: r.image_url,  
  tags: r.tags,            
  ingredients: r.ingredients,
}));

// /* 선택한 재료로 레시피 검색 */
// export async function searchRecipesByIngredients(selectedIngredients) {
//   await new Promise((r) => setTimeout(r, 200));

//   if (!selectedIngredients || selectedIngredients.length === 0) {
//     return [];
//   }

//   const lower = selectedIngredients.map((i) => i.toLowerCase());

//   const filtered = dummySearchRecipes.filter((recipe) =>
//     recipe.ingredients.some((ing) => lower.includes(ing.toLowerCase()))
//   );

//   // 추천 3개만 리턴
//   return filtered.slice(0, 3);
// }

/* 전체 레시피 목록 */
export function fetchAllRecipes() {
  return Promise.resolve(RECIPES);
}

// /* 레시피 상세 조회  */
// export function fetchRecipeById(id) {
//   return Promise.resolve(RECIPES.find((r) => r.id === Number(id)) || null);
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
// export async function fetchSavedRecipes() {
//   await new Promise((r) => setTimeout(r, 200));
//   return RECIPES;
// }


/* 레시피 삭제 */
// export async function deleteRecipe(id) {
//   await new Promise((r) => setTimeout(r, 150));
//   return true; 
// }
