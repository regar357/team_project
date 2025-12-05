# 객체 인식 모델 
import cv2
import base64
import numpy as np
from ultralytics import YOLO


def load_yolo_model(model_path: str):
    """
    YOLO 모델 로드
    """
    return YOLO(model_path)


def load_image_from_path(image_path: str):
    """
    이미지 파일 경로로부터 numpy 이미지 로드
    """
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"이미지를 찾을 수 없습니다: {image_path}")
    return img


def run_yolo_detection(model, image):
    """
    YOLO 모델로 객체 인식 수행
    """
    results = model(image)
    return results[0]   # 첫 번째 결과만 반환


def extract_labels(result):
    """
    YOLO 결과에서 라벨(클래스명)만 추출
    반환 형식:
    ["apple", "cucumber", "onion"]
    """
    labels = []
    for box in result.boxes:
        cls_id = int(box.cls)
        label = result.names[cls_id]
        labels.append(label)
    return labels
