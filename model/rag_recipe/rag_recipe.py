# rag_recipe.py
# RAG(FAISS) + Groq LLM 기반 레시피 추천 모듈
import sys
import json
import re
from typing import Optional

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from llm_client import client   # 우리가 만든 Groq 클라이언트 (llm_client.py)


# ===== 0. 텍스트 클리닝 유틸 =====

def clean_text(text: str) -> str:
    """
    한글, 영어, 숫자, 기본 특수문자(.,!?() 공백)만 남기고 모두 제거.
    이상한 한자/중국어/이모지 같은 거 싹 필터링.
    """
    return re.sub(r"[^가-힣0-9a-zA-Z.,!?()\s]", "", text)


def clean_recipe_json(obj):
    """
    레시피 JSON 전체를 재귀적으로 돌면서
    문자열이면 clean_text()를 적용.
    """
    if isinstance(obj, dict):
        return {k: clean_recipe_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_recipe_json(x) for x in obj]
    elif isinstance(obj, str):
        return clean_text(obj)
    else:
        return obj


# ===== 1. FAISS 인덱스 & 레시피 메타 로딩 =====
# 한 번만 로딩해서 재사용

model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

index = faiss.read_index("data/recipes.index")

with open("data/recipes_meta.json", "r", encoding="utf-8") as f:
    recipes_meta = json.load(f)


# ===== 2. RAG 검색 (임박 재료 → 비슷한 레시피 찾기) =====

def search_recipes(expiring_ingredients, top_k: int = 5):
    """
    expiring_ingredients: ["닭가슴살 300g", "양파 2개", ...] 같은 리스트
    top_k: 몇 개의 유사 레시피를 가져올지
    """
    query = ", ".join(expiring_ingredients)

    # 문장 임베딩 벡터 생성
    query_vec = model.encode([query], convert_to_numpy=True).astype("float32")

    # FAISS에서 유사한 레시피 top_k개 검색
    distances, indices = index.search(query_vec, top_k)

    results = []
    for rank, idx in enumerate(indices[0]):
        recipe = recipes_meta[int(idx)]
        results.append(
            {
                "rank": rank + 1,
                "distance": float(distances[0][rank]),
                "recipe": recipe,
            }
        )

    return results


# ===== 3-1. 1차 LLM 레시피 생성 =====

def generate_recipe_with_llm(expiring_ingredients, search_results, style_hint: Optional[str] = None):
    """
    RAG로 가져온 레시피 요약 + 임박 재료 정보를 이용해
    1차 레시피 JSON 생성.
    style_hint: "볶음", "찜", "국/탕", "샐러드" 같은 요리 스타일 힌트 (없으면 None)
    """

    # RAG로 찾은 레시피들을 간단히 텍스트로 정리
    retrieved_text = ""
    for item in search_results:
        r = item["recipe"]
        title = r.get("title", "제목 없음")
        ingredients = ", ".join(r.get("ingredients", []))
        retrieved_text += f"- {title} | 재료: {ingredients}\n"

    # 스타일 힌트 문장
    style_sentence = (
        f"요리 스타일은 반드시 '{style_hint}' 느낌의 요리로 만들어라. "
        "조리법과 맛, 식감이 그 스타일답게 느껴져야 한다."
        if style_hint
        else "요리 스타일은 자유롭게 정하되, 재료를 최대한 활용해서 합리적인 한 가지 요리를 만들어라."
    )

    # 🔥 시스템 프롬프트 (품질 + 한국어 + 이상한 문자 방지에 집중)
    system_prompt = """
너는 냉장고 임박 재료를 우선 사용해 레시피를 만드는 고급 요리 추천 AI야.

반드시 아래 규칙을 지켜서 출력해라.

1. 출력은 JSON 형식만 사용한다.
2. JSON의 key 이름(title, description 등)은 절대 변경하지 않는다.
3. title, description의 "값(value)"은 반드시 영어로만 작성한다. (한글 포함 금지)
4. title, description을 제외한 모든 텍스트 값은 한국어와 숫자, 기본 특수문자(.,!?() 공백)만 사용한다.
5. title, description을 제외한 필드에는 영어/일본어/중국어/한자/이모지/의미불명 문자를 절대 사용하지 않는다.
6. 맞춤법과 띄어쓰기를 지키고, 자연스럽고 읽기 편한 문장으로 작성한다.
7. 임박 재료는 반드시 실제로 사용하는 재료 목록과 조리 과정에 모두 반영한다.
8. 요리 단계는 구체적이고 따라 하기 쉽게 작성한다.
9. 과장된 표현(“JMT”, “대박”, “존맛” 등)이나 인터넷 용어는 사용하지 않는다.

JSON 스키마는 다음과 같다.

{
  "title": "요리 이름",
  "description": "간단 소개",
  "priority_used_ingredients": ["임박 재료 중 실제로 사용한 것들"],
  "other_ingredients": ["추가로 필요한 재료들"],
  "servings": 2,
  "steps": [
    "1단계 설명",
    "2단계 설명"
  ],
  "tips": [
    "추가 TIP"
  ]
}
"""

    user_prompt = f"""
다음은 임박 재료 목록이야:

임박 재료: {", ".join(expiring_ingredients)}

이 재료들을 최대한 우선 사용해서 요리 하나를 만들어줘.
{style_sentence}

아래는 참고용으로 준비한 비슷한 레시피 목록이야. 참고만 하고 그대로 복붙하지는 마.

[참고 레시피 목록]
{retrieved_text}

위 규칙과 JSON 스키마를 지켜서 1개의 레시피만 JSON 형식으로 출력해.
"""

    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    content = resp.choices[0].message.content

    try:
        first_recipe = json.loads(content)
    except json.JSONDecodeError:
        # 혹시 JSON 파싱 실패하면 아주 단순한 기본 구조로 fallback
        first_recipe = {
            "title": "임시 레시피",
            "description": clean_text(content),
            "priority_used_ingredients": expiring_ingredients,
            "other_ingredients": [],
            "servings": 1,
            "steps": [],
            "tips": [],
        }

    return first_recipe


# ===== 3-2. 2차 LLM 평가/보정 =====

def refine_recipe_with_llm(expiring_ingredients, first_recipe, style_hint: Optional[str] = None):
    """
    1차 레시피를 다시 LLM에 보내서
    한국어 / 흐름 / 재료 사용 여부 등을 보정하는 단계.
    style_hint: 1차 생성 때 사용한 요리 스타일 힌트 (있으면 동일하게 전달)
    """

    system_prompt = """
너는 요리 전문가이자 한국어 문장 교정 전문가야.

아래 JSON 레시피를 검토하여 다음 기준에 따라 필요한 부분만 수정해라.

1. 출력은 JSON 형식만 사용한다.
2. JSON의 key 이름은 절대 변경하지 않는다.
3. title, description의 값은 반드시 영어로만 유지/보정한다. (한글 포함 금지)
4. title, description을 제외한 모든 텍스트 값은 한국어, 숫자, 기본 특수문자(.,!?() 공백)만 사용한다.
5. 영어, 일본어, 중국어, 한자, 이모지, 의미 불명 문자는 절대 사용하지 않는다.
6. 맞춤법, 띄어쓰기, 문장 어투를 자연스럽게 정리한다.
7. 조리 단계는 논리적인 순서로, 실제로 따라 할 수 있게 구체적으로 작성한다.
8. 임박 재료는 가능한 한 많이 활용하되, 과한 양은 피한다.
9. 레시피의 기본 구조(키 이름)는 유지한다.

조건을 위반하는 문자가 나오지 않도록 특히 주의해라.
"""

    first_recipe_text = json.dumps(first_recipe, ensure_ascii=False, indent=2)

    style_info = (
        f"\n[요리 스타일 힌트]\n이 레시피는 '{style_hint}' 스타일의 요리답게 느껴지도록 유지·보정해라.\n"
        if style_hint
        else ""
    )

    user_prompt = f"""
다음은 1차로 생성된 레시피야. 기준에 맞게 다듬어줘.

[임박 재료]
{", ".join(expiring_ingredients)}
{style_info}
[1차 레시피 JSON]
{first_recipe_text}
"""

    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    content = resp.choices[0].message.content

    try:
        final_recipe = json.loads(content)
    except json.JSONDecodeError:
        # 보정 단계에서 실패하면 1차 레시피를 그대로 사용
        final_recipe = first_recipe

    return final_recipe


# ===== 4. 전체 추천 파이프라인 =====

def recommend_recipe(expiring_ingredients, style_hint: Optional[str] = None):
    """
    입력 재료 리스트를 받아
    1차 레시피 + 보정된 최종 레시피를 딕셔너리로 반환.
    style_hint: "볶음", "찜", "국/탕", "샐러드" 등 스타일 힌트 (없으면 None)
    (API에서 result["first_recipe"], result["final_recipe"] 로 사용)
    """
    # 1) RAG 검색
    search_results = search_recipes(expiring_ingredients, top_k=5)

    # 2) 1차 LLM 레시피 생성 (스타일 힌트 전달)
    first_recipe = generate_recipe_with_llm(expiring_ingredients, search_results, style_hint=style_hint)

    # 3) 2차 LLM 평가/보정 (같은 스타일 힌트 전달)
    final_recipe = refine_recipe_with_llm(expiring_ingredients, first_recipe, style_hint=style_hint)

    # 4) 이상한 문자/문자열 제거
    first_recipe = clean_recipe_json(first_recipe)
    final_recipe = clean_recipe_json(final_recipe)

    # 딕셔너리 형태로 반환
    return {
        "final_recipe": final_recipe,
    }



# ===== 디버그/CLI용 진입점 (Node child_process에서 호출) =====
if __name__ == "__main__":
    """
    Node.js 에서 예를 들면 이렇게 호출한다고 가정:

      const argsJson = JSON.stringify({
        ingredients: ["계란", "우유", "파스타"]
      });

      spawn("python", ["rag_recipe.py", argsJson]);

    이때 sys.argv[1] 에 JSON 문자열이 들어온다.
    """
    sys.stdout.reconfigure(encoding='utf-8')
    # 1) 인자가 있는지 확인
    if len(sys.argv) < 2:
        error_payload = {"error": "JSON 인자가 없습니다. (sys.argv[1])"}
        print(json.dumps(error_payload, ensure_ascii=False))
        sys.exit(1)

    raw_json = sys.argv[1]

    # 2) JSON 파싱
    try:
        payload = json.loads(raw_json)
    except json.JSONDecodeError:
        error_payload = {
            "error": "JSON 파싱 실패",
            "raw": raw_json,
        }
        print(json.dumps(error_payload, ensure_ascii=False))
        sys.exit(1)

    # 3) ingredients 리스트 꺼내기
    #   - {"ingredients":[...]} 형식 또는 그냥 리스트 둘 다 지원
    if isinstance(payload, dict):
        ingredients = payload.get("ingredients", [])
    else:
        ingredients = payload

    if not isinstance(ingredients, list):
        error_payload = {
            "error": "ingredients는 리스트여야 합니다.",
            "payload": payload,
        }
        print(json.dumps(error_payload, ensure_ascii=False))
        sys.exit(1)

    # 4) 모델 호출
    result = recommend_recipe(ingredients)

    # 5) 결과를 JSON 문자열로 print → Node 의 stdout으로 전달
    print(json.dumps(result, ensure_ascii=False))

    # 6) 정상 종료 코드 (슬라이드처럼 SUCCESS 개념)
    sys.exit(0)

