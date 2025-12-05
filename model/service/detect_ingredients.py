# 객체 인식 모델 실행 → {name, category} JSON 반환
import os
import sys
import json

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
sys.path.append(BASE_DIR)

from collections import Counter

# yoloutil 함수 가져오기
from utils.yoloutil import (
    load_yolo_model,
    load_image_from_path,
    run_yolo_detection,
    extract_labels
)

# YOLO 모델 경로
MODEL_PATH = os.path.join(BASE_DIR, "weights", "best.pt")

# 카테고리 매핑 파일
CATEGORY_PATH = os.path.join(BASE_DIR, "category", "category_map.json")
with open(CATEGORY_PATH, "r", encoding="utf-8") as f:
    CATEGORY_MAP = json.load(f)


def map_category(label: str):
    """YOLO 라벨명을 기반으로 카테고리 매핑"""
    return CATEGORY_MAP.get(label, "기타")


def detect_from_image(image_path: str):
    """이미지를 입력받아 YOLO 객체 인식 + 카테고리 매핑까지 수행"""

    # 1) 모델 로드
    model = load_yolo_model(MODEL_PATH)

    # 2) 이미지 로드
    img = load_image_from_path(image_path)

    # 3) YOLO 추론
    result = run_yolo_detection(model, img)

    # 4) 라벨만 추출
    labels = extract_labels(result)

    # 5) 개수 계산
    count_dict = Counter(labels)

    # 6) [{name, category, count}, ...] 형태로 변환(json)
    output = []
    for label, count in count_dict.items():
        output.append({
            "name": label,
            "category": map_category(label),
            "count": count
        })

    return output


def main():
    """백엔드가 호출하는 실행 엔트리포인트"""

    if len(sys.argv) < 2:
        print(json.dumps({"error": "image path missing"}, ensure_ascii=False))
        sys.exit(1)

    image_path = sys.argv[1]

    # 모델 실행
    result = detect_from_image(image_path)

    # JSON 반환 (백엔드에서 stdout으로 읽음)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
