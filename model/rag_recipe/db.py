# db.py
from sqlalchemy import create_engine, Column, Integer, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

# SQLite DB 파일 경로 (현재 폴더에 recipes.db 파일 생성)
DATABASE_URL = "sqlite:///./recipes.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # SQLite용 옵션
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class RecipeRecord(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    ingredients_text = Column(Text)  # 입력 재료를 문자열로 저장
    final_recipe_json = Column(Text)  # 최종 레시피 JSON 문자열 통째로 저장


def init_db():
    Base.metadata.create_all(bind=engine)