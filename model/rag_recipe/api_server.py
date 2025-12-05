# api_server.py
# FastAPI 서버: RAG + Groq LLM + 이미지 기반 레시피 추천

from typing import Dict, Any, List
import os
import json
import traceback

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from db import SessionLocal, RecipeRecord, init_db
from rag_recipe import recommend_recipe
from image_ingredient import extract_ingredients_from_image

# =========================
# 0. Pydantic 응답 모델
# =========================

class RecipeResponse(BaseModel):
    first_recipe: Dict[str, Any]
    final_recipe: Dict[str, Any]
    image_url: str


class HistoryItem(BaseModel):
    id: int
    ingredients_text: str
    created_at: str


class HistoryResponse(BaseModel):
    items: List[HistoryItem]


# =========================
# 1. FastAPI & 공통 설정
# =========================

app = FastAPI(title="RAG Recipe API")

# DB 초기화
init_db()

# 정적 파일 (음식 이미지) 제공
os.makedirs("static/images", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS (프론트엔드에서 호출 가능하게)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # 필요하면 도메인으로 제한 가능
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# 2. 레시피 이미지 URL 생성
# =========================

STATIC_BASE_URL = "http://127.0.0.1:8000/static/images"


def get_image_url(final_recipe: Dict[str, Any]) -> str:
    """
    레시피 제목을 보고 적당한 이미지 파일을 매핑.
    없으면 기본 이미지(default_food.jpg)를 사용.
    """
    title = (final_recipe.get("title") or "").lower()

    # 치킨/양파
    if "닭" in title or "chicken" in title:
        return f"{STATIC_BASE_URL}/chicken_onion.jpg"

    # 당근/계란
    if "당근" in title or "carrot" in title:
        return f"{STATIC_BASE_URL}/carrot_egg.jpg"

    # 계란 + 밥 (계란볶음밥 같은 느낌)
    if ("계란" in title or "egg" in title) and ("밥" in title or "rice" in title):
        return f"{STATIC_BASE_URL}/egg_rice.jpg"

    # 오렌지/주스
    if "오렌지" in title or "orange" in title:
        return f"{STATIC_BASE_URL}/orange_juice.jpg"

    # 기본 이미지
    return f"{STATIC_BASE_URL}/default_food.jpg"


# =========================
# 3. 텍스트 기반 레시피 추천
# =========================

@app.post("/recommend", response_model=RecipeResponse)
async def recommend_from_text(payload: Dict[str, Any]):
    """
    프론트엔드에서 JSON:
    {
        "ingredients": ["닭가슴살", "양파", "간장", "마늘"]
    }
    이런 형식으로 보냄.
    """
    try:
        ingredients = payload.get("ingredients")
        if not ingredients or not isinstance(ingredients, list):
            raise HTTPException(status_code=400, detail="ingredients 리스트가 필요합니다.")

        # RAG + LLM 레시피 추천
        result = recommend_recipe(ingredients)
        first_recipe = result["first_recipe"]
        final_recipe = result["final_recipe"]

        # 이미지 URL
        image_url = get_image_url(final_recipe)

        # DB 저장
        session = SessionLocal()
        try:
            record = RecipeRecord(
                ingredients_text=", ".join(ingredients),
                final_recipe_json=json.dumps(final_recipe, ensure_ascii=False),
            )
            session.add(record)
            session.commit()
        finally:
            session.close()

        return RecipeResponse(
            first_recipe=first_recipe,
            final_recipe=final_recipe,
            image_url=image_url,
        )

    except HTTPException:
        raise
    except Exception as e:
        # 서버 콘솔에 에러 출력
        print("=== /recommend 오류 ===")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"서버 내부 오류: {e}")


# =========================
# 4. 이미지 기반 레시피 추천
# =========================

@app.post("/recommend_from_image", response_model=RecipeResponse)
async def recommend_from_image(file: UploadFile = File(...)):
    """
    음식 사진을 업로드하면:
    1) uploads/ 폴더에 저장
    2) YOLO로 재료 인식
    3) RAG + LLM으로 레시피 추천
    4) DB 저장 + 이미지 URL 반환
    """
    try:
        # 1) 이미지 파일 여부 / 타입 체크
        if not file:
            raise HTTPException(status_code=400, detail="이미지 파일이 없습니다.")

        allowed_types = ["image/jpeg", "image/jpg", "image/png"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"지원하지 않는 이미지 형식입니다. jpg/png만 업로드해주세요. (현재: {file.content_type})",
            )

        # 2) 임시 저장 경로 생성
        os.makedirs("uploads", exist_ok=True)

        # 카카오톡 파일명 대비: ? 뒤는 제거
        safe_filename = file.filename.split("?")[0]
        temp_path = os.path.join("uploads", safe_filename)

        # 2-1) 파일 저장
        try:
            file_bytes = await file.read()
            with open(temp_path, "wb") as f:
                f.write(file_bytes)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"파일 저장 실패: {e}")

        # 3) YOLO로 재료 인식
        try:
            ingredients = extract_ingredients_from_image(temp_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"이미지 분석 중 오류: {e}")

        if not ingredients:
            raise HTTPException(status_code=400, detail="이미지에서 재료를 인식하지 못했습니다.")

        # 4) 텍스트 기반 추천과 동일한 흐름
        try:
            result = recommend_recipe(ingredients)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"레시피 생성 중 오류: {e}")

        first_recipe = result["first_recipe"]
        final_recipe = result["final_recipe"]
        image_url = get_image_url(final_recipe)

        # 5) DB 저장
        session = SessionLocal()
        try:
            record = RecipeRecord(
                ingredients_text=", ".join(ingredients),
                final_recipe_json=json.dumps(final_recipe, ensure_ascii=False),
            )
            session.add(record)
            session.commit()
        finally:
            session.close()

        return RecipeResponse(
            first_recipe=first_recipe,
            final_recipe=final_recipe,
            image_url=image_url,
        )

    except HTTPException:
        # 이미 의미 있는 에러 메시지를 넣었으니 그대로 전달
        raise
    except Exception as e:
        print("=== /recommend_from_image 오류 ===")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"서버 내부 오류: {e}")


# =========================
# 5. 최근 추천 기록 조회 (/history)
# =========================

@app.get("/history", response_model=HistoryResponse)
async def get_history(limit: int = 5):
    session = SessionLocal()
    try:
        records = (
            session.query(RecipeRecord)
            .order_by(RecipeRecord.created_at.desc())
            .limit(limit)
            .all()
        )

        items: List[HistoryItem] = []
        for r in records:
            items.append(
                HistoryItem(
                    id=r.id,
                    ingredients_text=r.ingredients_text,
                    created_at=r.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                )
            )

        return HistoryResponse(items=items)
    finally:
        session.close()