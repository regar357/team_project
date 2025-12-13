# weekly_plan.py
import json
import os
import sys
import random

# sys.path에 model/ 경로 추가 (가장 중요한 FIX)
# 현재 파일 경로 weekly_plan/weekly_plan.py
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# model 폴더 경로 = weekly_plan 상위 폴더
MODEL_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
sys.path.append(MODEL_DIR)

# model 폴더를 파이썬 모듈 검색 경로에 추가
if MODEL_DIR not in sys.path:
    sys.path.append(MODEL_DIR)

from rag_recipe.llm_client import client


# 요일 순서
DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

# 영양 균형 카테고리 타입
NUTRITION_TYPES = ["protein", "carbs", "balanced"]


def build_system_prompt():
    return """
너는 영양 균형 기반으로 주간 식단 메뉴를 추천하는 전문 요리 플래너 AI이다.

규칙:
1. 출력은 반드시 JSON ONLY로 한다.
2. JSON 구조는 다음 형식을 따른다:

{
  "weekly_plan": {
    "Mon": [
      { "title": "메뉴 이름", "image_url": "..." },
      ...
    ],
    "Tue": [...],
    ...
  }
}

3. 각 요일은 3~4개의 메뉴를 포함한다.
4. 메뉴는 서로 중복되지 않아야 한다.
5. 메뉴 설명, 레시피, 조리 시간 등 불필요한 정보는 포함하지 않는다.
6. image_url은 Unsplash를 사용하여 생성한다:
   예시: "https://source.unsplash.com/featured/?chicken-salad"
7. 메뉴는 실제 한식/일식/양식/간편식 등 다양한 형태로 자연스럽게 조합한다.
8. 식단의 영양 균형을 맞추기 위해 단백질 / 탄수화물 / 균형형 요리를 적절히 배분한다.
"""


def build_user_prompt(num_per_day=3):
    return f"""
7일 동안 요일별로 {num_per_day}개의 식단 메뉴를 생성해라.
선택된 재료는 없으며, 완전 자동 생성이다.

각 메뉴는 title + image_url만 포함한다.
image_url은 반드시 Unsplash 검색 URL로 생성하라.

반드시 JSON만 출력하라.
"""


def generate_weekly_meal_plan(num_per_day=3):
    system_prompt = build_system_prompt()
    user_prompt = build_user_prompt(num_per_day)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt.strip()},
            {"role": "user", "content": user_prompt.strip()}
        ],
        temperature=0.8,
        max_tokens=2048
    )

    content = response.choices[0].message.content

    try:
        data = json.loads(content)
    except json.JSONDecodeError:
        data = {"weekly_plan": {}}

    # 최소 형태 보정
    if "weekly_plan" not in data:
        data["weekly_plan"] = {}

    return data


if __name__ == "__main__":
    result = generate_weekly_meal_plan(num_per_day=3)
    print(json.dumps(result, ensure_ascii=False, indent=2))
