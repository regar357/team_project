// src/pages/IngredientsPage.js
import React, { useState } from "react";
import "./IngredientsPage.css";

// D-day 계산
function getDday(expiryStr) {
  if (!expiryStr) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryStr);
  expiry.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "D - DAY";
  if (diffDays > 0) return `D - ${diffDays}`;
  return `D + ${Math.abs(diffDays)}`;
}

// D-day 색상 클래스
function getDdayClass(expiryStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryStr);
  expiry.setHours(0, 0, 0, 0);
  const diffDays = Math.round((expiry - today) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "dday dday-danger";
  if (diffDays <= 4) return "dday dday-warning";
  if (diffDays <= 10) return "dday dday-safe";
  return "dday";
}

// 유통기한 표시용: "YYYY-MM-DD..." → "YYYY.MM.DD"
function formatExpiryDate(expiry) {
  if (!expiry) return "-";
  const s = String(expiry);
  const datePart = s.length >= 10 ? s.slice(0, 10) : s; // 앞 10글자만
  return datePart.replace(/-/g, ".");
}

function IngredientsPage() {
  const [ingredients, setIngredients] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    expiry: "",
    imageFile: null,
  });
  const [editingIndex, setEditingIndex] = useState(null);

  // 업로드 상태/결과
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  // 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 서버 업로드 함수 (POST /food/upload)
  const uploadFoodImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/food/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`이미지 업로드 실패 (${res.status})`);
    }

    const data = await res.json().catch(() => ({}));
    return data;
  };

  // 파일 선택 즉시 자동 업로드
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0] ?? null;

    // 같은 파일 다시 선택 가능
    e.target.value = "";

    setForm((prev) => ({ ...prev, imageFile: file }));
    setUploadError("");
    setUploadedImageUrl("");

    if (!file) return;

    try {
      setUploading(true);

      const data = await uploadFoodImage(file);
      console.log("이미지 업로드 응답:", data);

      // 서버 응답 키 대응 (이미지 URL)
      const url =
        data.url || data.imageUrl || data.path || data.location || "";
      setUploadedImageUrl(url);

      // 결과 배열을 테이블용 데이터로 변환해서 바로 반영
      if (Array.isArray(data.results)) {
        const normalized = data.results.map((item, idx) => ({
          id: item.food_id ?? item.id ?? idx,
          food_id: item.food_id ?? item.id ?? idx,
          name: item.name ?? item.foodName ?? item.ingredientName ?? "",
          category: item.category ?? item.type ?? "",
          // 백엔드 응답에 맞춰 유통기한 필드 추론
          expiry:
            item.expirationDate ??
            item.expiry ??
            item.expiryDate ??
            item.expiration_date ??
            "",
          imageUrl: item.imageUrl ?? "",
        }));

        setIngredients(normalized);
      }
    } catch (err) {
      console.error("업로드 오류:", err);
      setUploadError(err?.message ?? "업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  // 수정 API 호출 함수
  const updateFood = async (foodId, payload) => {
    const res = await fetch(`/food/update/${foodId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`수정 실패 (${res.status})`);
    }

    // 응답이 비어있을 수도 있으니 안전 처리
    const data = await res.json().catch(() => ({}));
    return data;
  };

  // 선택된 행 수정 + 서버 PUT 연동
  const handleUpdate = async () => {
    if (editingIndex === null) {
      alert("수정할 항목을 먼저 목록에서 선택해 주세요.");
      return;
    }
    if (!form.name || !form.category || !form.expiry) {
      alert("식재료명, 카테고리, 유통기한을 모두 입력해 주세요.");
      return;
    }

    const target = ingredients[editingIndex];
    const foodId = target?.food_id ?? target?.id; // 둘 다 대응

    if (!foodId) {
      alert("food_id가 없습니다. 목록 데이터에 id(또는 food_id)가 필요합니다.");
      return;
    }

    const imageUrlToSend = uploadedImageUrl || target?.imageUrl || "";

    // 서버로 보낼 payload
    const payload = {
      name: form.name,
      category: form.category,
      expiry: form.expiry,
      // imageUrl: imageUrlToSend, // 백엔드에서 필요하면 주석 해제
    };

    try {
      const data = await updateFood(foodId, payload);
      console.log("PUT /food/update 성공:", data);

      // 프론트 화면도 즉시 반영
      const updated = [...ingredients];
      updated[editingIndex] = {
        ...target,
        name: form.name,
        category: form.category,
        expiry: form.expiry,
        imageUrl: imageUrlToSend,
      };
      setIngredients(updated);

      // 입력 상태 정리
      setEditingIndex(null);
      setForm({ name: "", category: "", expiry: "", imageFile: null });
      setUploadedImageUrl("");
      setUploadError("");

      alert("수정 완료!");
    } catch (err) {
      console.log("수정 오류:", err);
      alert(err?.message ?? "수정 중 오류가 발생했습니다.");
    }
  };

  // 행 클릭 시 폼에 불러오기
  const handleRowClick = (idx) => {
    const item = ingredients[idx];
    setForm({
      name: item.name,
      category: item.category,
      expiry: item.expiry,
      imageFile: null,
    });

    setUploadedImageUrl(item.imageUrl || "");
    setUploadError("");
    setEditingIndex(idx);
  };

  return (
    <div className="recipe-page">
      <div className="recipe-inner">
        <section className="header-hero">
          <h1>Ingredients upload</h1>
          <p>식품 등록</p>
        </section>

        {/* 사진 업로드 + 입력 폼 카드 */}
        <section className="recipe-top-card">
          {/* 왼쪽 사진 업로드 */}
          <div className="photo-upload">
            <div className="photo-box">
              <label className="photo-button">
                <span>{uploading ? "업로드 중..." : "+ 사진 업로드"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
              <p className="photo-help">냉장고 속 이미지를 등록하세요</p>
            </div>

            {form.imageFile && (
              <div className="photo-filename">{form.imageFile.name}</div>
            )}

            {uploadedImageUrl && (
              <div className="photo-filename">업로드 완료</div>
            )}

            {uploadError && (
              <div className="photo-filename" style={{ color: "#e74c3c" }}>
                {uploadError}
              </div>
            )}
          </div>

          {/* 오른쪽 입력 폼 */}
          <div className="recipe-form">
            <div className="form-row">
              <label className="form-label">식재료명</label>
              <input
                className="form-input"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="예: 토마토"
              />
            </div>

            <div className="form-row">
              <label className="form-label">카테고리</label>
              <input
                className="form-input"
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="예: 채소"
              />
            </div>

            <div className="form-row">
              <label className="form-label">유통기한</label>
              <input
                className="form-input"
                type="date"
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label className="form-label">임박일</label>
              <div className="form-static">
                {form.expiry ? getDday(form.expiry) : "-"}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleUpdate}
                disabled={uploading}
              >
                수정
              </button>
            </div>
          </div>
        </section>

        {/* 아래 목록 테이블 카드 */}
        <section className="recipe-list-card">
          <div className="recipe-table-wrapper">
            <table className="recipe-table">
              <thead>
                <tr>
                  <th>식재료명</th>
                  <th>카테고리</th>
                  <th>유통기한</th>
                  <th>임박일</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((item, idx) => (
                  <tr
                    key={`${item.food_id ?? item.id ?? idx}`}
                    onClick={() => handleRowClick(idx)}
                    className={
                      editingIndex === idx ? "row-selected" : undefined
                    }
                  >
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{formatExpiryDate(item.expiry)}</td>
                    <td className={getDdayClass(item.expiry)}>
                      {item.expiry ? getDday(item.expiry) : "-"}
                    </td>
                  </tr>
                ))}

                {ingredients.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: 16 }}>
                      업로드된 식재료가 없습니다. 사진을 업로드해 보세요.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default IngredientsPage;
