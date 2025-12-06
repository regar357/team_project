import React, { useState } from "react";
import "./IngredientsPage.css";

// 데이터베이스로 연결될거라 지워도 됩니다. 시각화용
const initialData = [
  { name: "가지", category: "채소", expiry: "2025-11-30" },
  { name: "사과", category: "과일", expiry: "2025-11-30" },
];

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

function IngredientsPage() {
  const [ingredients, setIngredients] = useState(initialData);
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

    // 같은 파일을 다시 선택해도 onChange가 다시 뜨게 하기
    e.target.value = "";

    setForm((prev) => ({ ...prev, imageFile: file }));
    setUploadError("");
    setUploadedImageUrl("");

    if (!file) return;

    try {
      setUploading(true);

      const data = await uploadFoodImage(file);

      // 서버 응답 키 대응
      const url =
        data.url ||
        data.imageUrl ||
        data.path ||
        data.location ||
        "";

      setUploadedImageUrl(url);
    } catch (err) {
      setUploadError(err?.message ?? "업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  // 새로 등록(현재는 프론트 임시 저장)
  const handleSave = () => {
    if (!form.name || !form.category || !form.expiry) {
      alert("식재료명, 카테고리, 유통기한을 모두 입력해 주세요.");
      return;
    }

    const newItem = {
      name: form.name,
      category: form.category,
      expiry: form.expiry,
      imageUrl: uploadedImageUrl || "",
    };

    setIngredients((prev) => [...prev, newItem]);
    setForm({ name: "", category: "", expiry: "", imageFile: null });
    setUploadedImageUrl("");
    setUploadError("");
    setEditingIndex(null);
  };

  // 선택된 행 수정
  const handleUpdate = () => {
    if (editingIndex === null) {
      alert("수정할 항목을 먼저 목록에서 선택해 주세요.");
      return;
    }
    if (!form.name || !form.category || !form.expiry) {
      alert("식재료명, 카테고리, 유통기한을 모두 입력해 주세요.");
      return;
    }

    const updated = [...ingredients];
    updated[editingIndex] = {
      name: form.name,
      category: form.category,
      expiry: form.expiry,
      imageUrl: uploadedImageUrl || updated[editingIndex]?.imageUrl || "",
    };

    setIngredients(updated);
    setEditingIndex(null);
    setForm({ name: "", category: "", expiry: "", imageFile: null });
    setUploadedImageUrl("");
    setUploadError("");
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
      <div className="recipe-card">
        <div className="recipe-card-top">
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={uploading}
              >
                저장
              </button>
            </div>
          </div>
        </div>

        {/* 아래 목록 테이블 */}
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
                  key={`${item.name}-${idx}`}
                  onClick={() => handleRowClick(idx)}
                  className={editingIndex === idx ? "row-selected" : undefined}
                >
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.expiry.replace(/-/g, ".")}</td>
                  <td className={getDdayClass(item.expiry)}>
                    {getDday(item.expiry)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default IngredientsPage;
