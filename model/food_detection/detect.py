import json
import requests
from collections import Counter
import os
import sys
from dotenv import load_dotenv
sys.stdout.reconfigure(encoding="utf-8")

# ---------------------------
# 0. 환경 변수 로드
# ---------------------------
load_dotenv()

API_KEY = os.getenv("ULTRALYTICS_API_KEY")

# ---------------------------
# 1. category_map.json 로드
# detect.py 위치: model/food_detection/detect.py
# category_map 위치: model/category/category_map.json
# ---------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CATEGORY_MAP_PATH = os.path.join(BASE_DIR, "../category/category_map.json")

with open(CATEGORY_MAP_PATH, "r", encoding="utf-8") as f:
    CATEGORY_MAP = json.load(f)

# ---------------------------
# 2. Ultralytics API 추론
# ---------------------------
url = "https://predict.ultralytics.com"
headers = {
    "x-api-key": API_KEY
}

data = {
    "model": "https://hub.ultralytics.com/models/ABUNZMg7ykq7mQz6Xt0L",
    "imgsz": 640,
    "conf": 0.25,
    "iou": 0.45
}

# 백엔드에서 이미지 경로를 인자로 넘긴다고 가정
IMAGE_PATH = sys.argv[1] if len(sys.argv) > 1 else None

if IMAGE_PATH is None or not os.path.exists(IMAGE_PATH):
    print(json.dumps({
        "items": [],
        "error": "Image path not provided or file does not exist"
    }, ensure_ascii=False))
    exit(1)

with open(IMAGE_PATH, "rb") as f:
    response = requests.post(
        url,
        headers=headers,
        data=data,
        files={"file": f}
    )

response.raise_for_status()
result_json = response.json()
# print(json.dumps(result_json, ensure_ascii=False, indent=2))
# ---------------------------
# 3. 결과 추출 (정답 경로)
# ---------------------------
results = []

if isinstance(result_json, list):
    if len(result_json) > 0 and "results" in result_json[0]:
        results = result_json[0]["results"]

elif isinstance(result_json, dict):
    if "images" in result_json and len(result_json["images"]) > 0:
        results = result_json["images"][0].get("results", [])

if not results:
    print(json.dumps({ "items": [] }, ensure_ascii=False))
    sys.exit(0)

# name 추출
CONF_THRESHOLD = 0.4
names = [obj["name"] for obj in results]
# boxes = result_json["results"][0]["boxes"]
# names = [box["name"] for box in boxes]
name_counter = Counter(names)

# ---------------------------
# 4. 최종 백엔드 전달 JSON 생성
# ---------------------------
items = []

for name, count in name_counter.items():
    items.append({
        "name": name,
        "category": CATEGORY_MAP.get(name, "기타"),
        "count": count
    })

final_output = {
    "items": items
}

# ---------------------------
# 5. stdout 출력 (백엔드가 받는 값)
# ---------------------------
print(json.dumps(final_output, ensure_ascii=False, indent=2))




# {"x-api-key": "551f61b5606bd15c1074997b2798ff8eabf8ab1337"}