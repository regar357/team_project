// ListPage.js
import React, { useMemo, useState, useEffect } from "react";
import "./ListPage.css";

// 초기 더미 데이터 (API 실패 시 화면용)
const initialIngredients = [
  { id: 1, name: "가지", category: "채소", expiry: "2025-11-30" },
  { id: 2, name: "사과", category: "과일", expiry: "2025-11-30" },
];

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

function getDdayNumber(expiryStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryStr);
  expiry.setHours(0, 0, 0, 0);
  return Math.round((expiry - today) / (1000 * 60 * 60 * 24));
}

function getDdayClass(expiryStr) {
  const diffDays = getDdayNumber(expiryStr);
  if (diffDays <= 0) return "dday dday-danger";
  if (diffDays <= 4) return "dday dday-warning";
  if (diffDays <= 10) return "dday dday-safe";
  return "dday";
}

// 카테고리 UI 목록
const categories = [
  { key: "전체", label: "전체", emoji: "🧺" },
  { key: "채소", label: "채소", emoji: "🥕" },
  { key: "과일", label: "과일", emoji: "🍎" },
  { key: "해산물", label: "해산물", emoji: "🐟" },
  { key: "육류", label: "육류", emoji: "🍗" },
  { key: "유제품", label: "유제품", emoji: "🥛" },
  { key: "가공식품", label: "가공식품", emoji: "🍕" },
  { key: "기타", label: "기타", emoji: "📦" },
];

export default function IngredientsListPage() {
  // 실제 목록 상태 (초기에는 더미 데이터)
  const [items, setItems] = useState(initialIngredients);

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortMode, setSortMode] = useState("임박순"); // 임박순 | 이름순 | 등록순
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  //페이지가 열릴 때 GET /food 자동 호출
  const fetchFoodList = async () => {
    try {
      setLoading(true);
      setFetchError("");

      const res = await fetch("/food", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`GET /food 실패 (${res.status})`);
      }

      const data = await res.json();
      console.log("GET /food 응답:", data);

      // 서버 응답을 프론트에서 쓰기 편하게 정규화
      const normalized = Array.isArray(data)
        ? data.map((item, idx) => ({
            id: item.id ?? item.food_id ?? idx,
            name: item.name,
            category: item.category,
            expiry: item.expiry,
          }))
        : [];

      if (normalized.length === 0) {
        console.warn("/food 응답이 비어있어서 더미 데이터를 사용합니다.");
        setItems(initialIngredients);
      } else {
        setItems(normalized);
      }
    } catch (err) {
      console.error("GET /food 오류:", err);
      setFetchError(err?.message ?? "목록을 불러오는 중 오류가 발생했습니다.");
      // 오류여도 최소한 더미 데이터는 보여주기
      setItems(initialIngredients);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodList();
  }, []);

  // -----------------------------
  // 2) 필터 + 검색 + 정렬
  // -----------------------------
  const filtered = useMemo(() => {
    let arr = [...items];

    // 카테고리 필터
    if (selectedCategory !== "전체") {
      arr = arr.filter((i) => i.category === selectedCategory);
    }

    // 검색어 필터
    const q = search.trim().toLowerCase();
    if (q) {
      arr = arr.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }

    // 정렬
    if (sortMode === "임박순") {
      arr.sort((a, b) => getDdayNumber(a.expiry) - getDdayNumber(b.expiry));
    } else if (sortMode === "이름순") {
      arr.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    } else if (sortMode === "등록순") {
      arr.sort((a, b) => b.id - a.id);
    }

    return arr;
  }, [items, selectedCategory, sortMode, search]);

  // -----------------------------
  // 3) 폐기 버튼 → DELETE /food/discard/:food_id
  // -----------------------------
  const handleDispose = async (id) => {
    const target = items.find((i) => i.id === id || i.food_id === id);
    if (!target) return;

    const ok = window.confirm(`${target.name}을(를) 폐기 처리할까요?`);
    if (!ok) return;

    const foodId = target.food_id ?? target.id;
    if (!foodId) {
      alert("food_id 정보가 없습니다. 서버 데이터 형식을 확인하세요.");
      return;
    }

    try {
      const res = await fetch(`/food/discard/${foodId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`DELETE 실패 (${res.status})`);
      }

      const data = await res.json().catch(() => ({}));
      console.log("DELETE /food/discard 응답:", data);

      // 화면에서도 제거
      setItems((prev) =>
        prev.filter((i) => (i.food_id ?? i.id) !== foodId)
      );
    } catch (err) {
      console.error("폐기 API 오류:", err);
      alert(err?.message ?? "폐기 처리 중 오류가 발생했습니다.");
    }
  };

  // 새 식재료 추가 버튼(지금은 임시)
  const handleAdd = () => {
    alert("새 식재료 추가 페이지로 이동 연결 예정!");
    // 예: navigate("/ingredients");
  };

  return (
    <div className="ingredients-list-page">
      <div className="ingredients-list-frame">

        <div className="topbar-line" />

        <section className="list-hero">
          <div className="hero-badge" />
          <div className="hero-text">
            <div className="hero-title">Ingredient</div>
            <div className="hero-title sub">List</div>
            <div className="hero-subtitle">
              냉장고에 저장된 식재료 목록을 한눈에 확인하세요
            </div>
          </div>
        </section>

        <section className="list-body">
          {/* ===== 왼쪽: 카테고리 ===== */}
          <aside className="category-panel">
            <div className="panel-title">By Categories</div>

            <div className="category-grid">
              {categories
                .filter((c) => c.key !== "전체")
                .map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className={`category-card ${
                      selectedCategory === c.key ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(c.key)}
                  >
                    <div className="category-icon">{c.emoji}</div>
                    <div className="category-label">{c.label}</div>
                  </button>
                ))}
            </div>
          </aside>

          {/* ===== 오른쪽: 리스트 패널 ===== */}
          <div className="list-panel">
            {/* 상단 툴바 */}
            <div className="list-toolbar">
              <div className="sort-group">
                {["임박순", "이름순", "등록순"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`sort-chip ${sortMode === m ? "active" : ""}`}
                    onClick={() => setSortMode(m)}
                  >
                    [{m}]
                  </button>
                ))}
              </div>

              <div className="toolbar-right">
                <button
                  type="button"
                  className="add-btn"
                  onClick={handleAdd}
                >
                  <span className="add-plus">＋</span>
                  새 식재료 추가
                </button>

                <div className="search-box">
                  <input
                    placeholder="SEARCH"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 테이블 카드 */}
            <div className="table-card">
              <table className="ingredients-table">
                <thead>
                  <tr>
                    <th>식재료명</th>
                    <th>카테고리</th>
                    <th>유통기한</th>
                    <th>임박일</th>
                    <th>폐기</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id ?? item.food_id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.expiry?.replace(/-/g, ".")}</td>
                      <td className={getDdayClass(item.expiry)}>
                        {getDday(item.expiry)}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="dispose-btn"
                          onClick={() =>
                            handleDispose(item.id ?? item.food_id)
                          }
                        >
                          폐기
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty-row">
                        조회 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
