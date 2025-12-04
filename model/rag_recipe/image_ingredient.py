# image_ingredient.py
from ultralytics import YOLO

# YOLO 모델 로드 (처음 한 번만 다운로드됨)
# 인터넷 연결 필요. 한 번 받으면 이후에는 로컬에서 사용.
model = YOLO("yolov8n.pt")  # 작은(빠른) 모델

# COCO 모델이 인식하는 클래스 중 "음식/식재료로 쓸만한 것"만 필터링
FOOD_LABELS = {
    "apple",
    "banana",
    "orange",
    "carrot",
    "broccoli",
    "cake",
    "sandwich",
    "pizza",
    "hot dog",
    "donut",
    "bowl",
    "cup",
    "bottle",
    "wine glass",
    "fork",
    "spoon",
    "knife",
    "carrot",
    "broccoli",
    "sandwich",
    "pizza",
    "cake",
    "donut",
}

def extract_ingredients_from_image(image_path: str) -> list[str]:
    """
    이미지 파일 경로를 받아서,
    YOLO로 물체를 감지한 뒤
    음식/식재료로 쓸만한 라벨만 골라서 리스트로 반환
    """
    results = model(image_path)[0]  # 첫 번째 결과만 사용
    names = model.model.names if hasattr(model, "model") else model.names

    detected = []

    for box in results.boxes:
        cls_id = int(box.cls)
        label = names[cls_id]
        if label in FOOD_LABELS:
            detected.append(label)

    # 중복 제거 + 정렬
    detected = sorted(set(detected))
    return detected