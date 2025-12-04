import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# 1) 레시피 데이터 로드
with open("data/recipes.json", "r", encoding="utf-8") as f:
    recipes = json.load(f)

# 2) 임베딩 모델 준비 (한글도 되는 범용 모델)
model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

# 3) 각 레시피를 하나의 문자열로 합쳐서 임베딩
texts = []
for r in recipes:
    text = f"{r['title']} 재료: {', '.join(r['ingredients'])}"
    texts.append(text)

embeddings = model.encode(texts, convert_to_numpy=True).astype("float32")

# 4) FAISS 인덱스 생성 (L2 거리 기준)
d = embeddings.shape[1]  # 벡터 차원
index = faiss.IndexFlatL2(d)
index.add(embeddings)

# 5) 인덱스와 메타 정보 저장
faiss.write_index(index, "data/recipes.index")

with open("data/recipes_meta.json", "w", encoding="utf-8") as f:
    json.dump(recipes, f, ensure_ascii=False, indent=2)

print("FAISS 인덱스 생성 완료!")