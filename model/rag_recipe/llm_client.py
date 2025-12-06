import os
from dotenv import load_dotenv
from groq import Groq

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # rag_recipe/ 상위 폴더
env_path = os.path.join(BASE_DIR, ".env")

load_dotenv(env_path)  # .env 파일 로드

api_key = os.getenv("GROQ_API_KEY") # env 변수 읽기

if not api_key:
    raise ValueError(f"❌ GROQ_API_KEY 환경 변수를 불러오지 못했습니다. 현재 참조 경로: {env_path}")

# LLM 클라이언트 생성
client = Groq(api_key=api_key)

def test_chat():
    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # Groq에서 제공하는 모델 예시
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "한 줄로 인사해줘."}
        ],
    )
    print(resp.choices[0].message.content)

if __name__ == "__main__":
    test_chat()