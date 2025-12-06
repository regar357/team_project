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
/* API 레시피 검색 */
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
        console.log("=== API 응답 원본 데이터 (JSON) ===");
        console.log(data);
        
        if (data && data.recipe && data.recipe.final_recipe) {
            const finalRecipe = data.recipe.final_recipe;
            console.log("[API] 단일 레시피 추출 완료:", finalRecipe.title); 
            return [finalRecipe]; 
        }

        if (data && Array.isArray(data.recipes)) {
            console.log(`[API] 'recipes' 배열 반환. 항목 수: ${data.recipes.length}`);
            return data.recipes; 
        }

        console.warn("API 응답에서 유효한 레시피 데이터를 찾을 수 없습니다:", data);
        
        if (Array.isArray(data)) {
            return data;
        }
        
        return []; 

    } catch (error) {
        console.error("레시피 검색/생성 중 오류 발생:", error);
        throw new Error(`레시피 생성 서버 오류: ${error.message}`);
    }
}


/* API 레시피 저장 */
export async function fetchSavedRecipes() {
  const API_ENDPOINT = '/recipe/list'; 

  const safeJsonParseOrSplit = (dataString) => {
    if (!dataString || typeof dataString !== 'string') return [];
    
    try {
      const parsed = JSON.parse(dataString);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
    }

    return dataString.split(',').map(item => item.trim()).filter(item => item.length > 0);
  };
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
    // console.log(data);

    const rawRecipes = (data && Array.isArray(data.recipes)) ? data.recipes : [];
    
    // 데이터 가공
        const processedRecipes = rawRecipes.map(recipe => {
            try {
                const tags = safeJsonParseOrSplit(recipe.priority_used_ingredients);

                return {
                    id: recipe.recipe_id, 
                    title: recipe.recipe_title, 
                    
                    priority_used_ingredients: priorityTags,
                    other_ingredients: safeJsonParseOrSplit(recipe.other_ingredients),
                    steps: safeJsonParseOrSplit(recipe.recipe_steps),
                    tips: safeJsonParseOrSplit(recipe.recipe_tips),
                    
                    category: recipe.category ?? '기타',
                    image_url: recipe.image_url ?? '/images/default_recipe.png', 
                    tags: priorityTags.slice(0, 3),

                    created_at: recipe.created_at,
                };
            } catch (e) {
                console.error("레시피 목록 JSON 파싱 오류로 항목 건너뜀:", e, recipe);
                return null; 
            }
        }).filter(r => r !== null);

        console.log(`[정규화] 최종 표시할 레시피 수: ${processedRecipes.length}`);
        return processedRecipes;
    
    
    // const allRecipes = (data && Array.isArray(data.recipes)) ? data.recipes : [];

    // const savedIds = getSavedRecipeIds();
    // const savedRecipes = allRecipes.filter(recipe => savedIds.includes(recipe.id));

    // return savedRecipes;


    /* 테스트 용 */
    // const allRecipes = RECIPES; 
    // console.log(`[MOCK] 전체 레시피 ${allRecipes.length}개 반환.`);
    // return  allRecipes;



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
  const API_ENDPOINT = `/recipe/list/${id}`; 

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
    // return data;


    const rawRecipe = (data && Array.isArray(data.recipes) && data.recipes.length > 0) 
                           ? data.recipes[0] 
                           : null;

        if (!rawRecipe) {
            console.warn(`레시피 ID ${id}: 서버 응답에 유효한 레시피 데이터가 없습니다.`);
            return null;
        }

        //  데이터 가공 
        try {
            const processedRecipe = {
                id: rawRecipe.recipe_id, 
                title: rawRecipe.recipe_title,
                description: rawRecipe.recipe_description,
                
             
                priority_used_ingredients: rawRecipe.priority_used_ingredients 
                    ? JSON.parse(rawRecipe.priority_used_ingredients) 
                    : [],
                other_ingredients: rawRecipe.other_ingredients 
                    ? JSON.parse(rawRecipe.other_ingredients) 
                    : [],
                steps: rawRecipe.recipe_steps 
                    ? JSON.parse(rawRecipe.recipe_steps) 
                    : [],
                tips: rawRecipe.recipe_tips 
                    ? JSON.parse(rawRecipe.recipe_tips) 
                    : [],
                servings: rawRecipe.servings,
                created_at: rawRecipe.created_at,
                image_url: rawRecipe.image_url ?? '/images/default_recipe.png', 
                isSaved: getSavedRecipeIds().includes(rawRecipe.recipe_id),
            };
            
            return processedRecipe;

        } catch (e) {
            console.error(`레시피 ID ${id} 상세 파싱 오류:`, e);
            throw new Error("레시피 데이터 구조 파싱 중 오류 발생");
        }

  } catch (error) {
    console.error(`레시피 ID ${id} 상세 조회 오류:`, error);
    return null;
  }
}


/* 로컬 스토리지 관리 유틸리티 함수 */

const STORAGE_KEY = "savedRecipes";

/* 로컬 스토리지에서 저장된 레시피 ID 목록 */
export function getSavedRecipeIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("로컬 스토리지 ID 로드 중 오류 발생:", e);
    return [];
  }
}
/* 로컬 스토리지에 레시피 ID 목록을 저장 */
export function setSavedRecipeIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}
/* 특정 레시피 ID의 저장 상태를 토글(저장 또는 삭제) */
export function toggleSaveRecipe(id) {
  const current = getSavedRecipeIds();
  const exists = current.includes(id);
  
  const next = exists ? current.filter((x) => x !== id) : [...current, id];
  
  setSavedRecipeIds(next);
  return next;
}