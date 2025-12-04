import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()  # .env 읽기

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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