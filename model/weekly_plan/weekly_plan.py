import json
import os
import sys
sys.stdout.reconfigure(encoding="utf-8")

# sys.path에 model/ 경로 추가 (가장 중요한 FIX)
# 현재 파일 경로 weekly_plan/weekly_plan.py
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))


# model 폴더 경로 추가
MODEL_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if MODEL_DIR not in sys.path:
    sys.path.append(MODEL_DIR)


from rag_recipe.llm_client import client


# 요일 순서
DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

# 영양 균형 카테고리 타입
NUTRITION_TYPES = ["protein", "carbs", "balanced"]  # 단백질/탄수화물/균형형


def build_system_prompt():
    return """
너는 냉장고 속 식재료를 기반으로
주간 식단 메뉴를 추천하는 전문 요리 플래너 AI이다.

목표:
- 현재 냉장고에 있는 식재료를 활용하여 일주일치 식단을 구성한다
- 일주일 동안 식단의 영양 균형을 맞춘다
- 각 요일은 하나의 '대표 영양 성향'을 가진다

대표 영양 성향은 다음 중 하나이다:
- protein : 단백질 위주
- carbs : 탄수화물 위주
- balanced : 균형형 식단

규칙:
1. 같은 영양 성향이 연속된 요일에 배치되지 않도록 한다
2. 일주일 전체에서 protein / carbs / balanced가 고르게 분포되도록 한다
3. 각 요일은 반드시 정확히 2개의 메뉴를 포함한다
4. 메뉴는 입력된 식재료를 최대한 활용하여 구성한다
5. 메뉴는 서로 중복되지 않는다
6. 메뉴는 실제 한식/일식/양식/간편식 등 다양하고 현실적인 식단으로 구성한다
7. 메뉴 설명, 레시피, 조리 시간 등 불필요한 정보는 포함하지 않는다

출력 규칙:
1. 출력은 반드시 JSON ONLY
2. 메뉴는 title만 포함한다

출력 형식:

{
  "weekly_plan": {
    "Mon": [ {"title": "메뉴 이름"}, {"title": "메뉴 이름"} ],
    "Tue": [ {"title": "메뉴 이름"}, {"title": "메뉴 이름"} ],
    "Wed": [ {"title": "메뉴 이름"}, {"title": "메뉴 이름"} ],
    "Thu": [ {"title": "메뉴 이름"}, {"title": "메뉴 이름"} ],
    "Fri": [ {"title": "메뉴 이름"}, {"title": "메뉴 이름"} ],
    "Sat": [ {"title": "메뉴 이름"}, {"title": "메뉴 이름"} ],
    "Sun": [ {"title": "메뉴 이름"}, {"title": "메뉴 이름"} ]
  }
}

"""


def build_user_prompt(ingredients):
    return f"""
다음은 백엔드로부터 전달받은
현재 냉장고 속 식재료 목록이다.

식재료 목록:
{json.dumps(ingredients, ensure_ascii=False)}

요구사항:
1. 위 식재료를 기반으로 주간 식단 메뉴를 생성하라
2. 요일 간 영양 성향(protein / carbs / balanced)이 겹치지 않도록 배분하라
3. 각 요일은 반드시 2개의 메뉴를 포함해야 한다
4. 메뉴는 서로 중복되지 않도록 한다
5. 반드시 JSON 형식으로만 출력하라
"""


def generate_weekly_meal_plan(ingredients): # ingredients: 식재료 목록
    system_prompt = build_system_prompt()
    user_prompt = build_user_prompt(ingredients)
    
    # LLM 호출
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt.strip()},
            {"role": "user", "content": user_prompt.strip()}
        ],
        temperature=0.7,
        max_tokens=1024
    )

    content = response.choices[0].message.content

    try:
        data = json.loads(content)
    except json.JSONDecodeError:
        data = {"weekly_plan": {}}

    return data

# 테스트
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "weekly_plan": {},
            "error": "Ingredients list not provided"
        }, ensure_ascii=False))
        sys.exit(1)

    try:
        ingredients = json.loads(sys.argv[1])
    except json.JSONDecodeError:
        print(json.dumps({
            "weekly_plan": {},
            "error": "Invalid ingredients format. Must be JSON list."
        }, ensure_ascii=False))
        sys.exit(1)
    
    result = generate_weekly_meal_plan(ingredients)
    print(json.dumps(result, ensure_ascii=False, indent=2))
