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
  return `D + ${Math.abs(diffDays)}`; // 이미 지난 경우
}

function getDdayClass(expiryStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryStr);
  expiry.setHours(0, 0, 0, 0);
  const diffDays = Math.round((expiry - today) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "dday dday-danger";   // D-DAY 또는 지남
  if (diffDays <= 4) return "dday dday-warning";  // D-1 ~ D-4
  if (diffDays <= 10) return "dday dday-safe";    // D-5 ~ D-10
  return "dday";                                  // 그 외
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

  // 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 파일 선택
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  // 새로 등록
  const handleSave = () => {
    if (!form.name || !form.category || !form.expiry) {
      alert("식재료명, 카테고리, 유통기한을 모두 입력해 주세요.");
      return;
    }

    const newItem = {
      name: form.name,
      category: form.category,
      expiry: form.expiry,
    };

    setIngredients((prev) => [...prev, newItem]);
    setForm({ name: "", category: "", expiry: "", imageFile: null });
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
    };
    setIngredients(updated);
    setEditingIndex(null);
    setForm({ name: "", category: "", expiry: "", imageFile: null });
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
    setEditingIndex(idx);
  };

  return (
    <div className="recipe-page">
      {/* 배경 위에 떠 있는 카드 */}
      <div className="recipe-card">
        {/* 상단 폼 영역 */}
        <div className="recipe-card-top">
          {/* 왼쪽 사진 업로드 */}
          <div className="photo-upload">
            <div className="photo-box">
              <label className="photo-button">
                <span>+ 사진 업로드</span>
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
              >
                수정
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
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
                  className={
                    editingIndex === idx ? "row-selected" : undefined
                  }
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
