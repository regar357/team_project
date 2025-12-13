// src/pages/ListPage.js
import React, { useMemo, useState, useEffect } from "react";
import "./ListPage.css";

// D-day 계산
function getDday(expiryStr) {
  if (!expiryStr) return "";
  const norm = normalizeExpiryForCalc(expiryStr);
  if (!norm) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(norm);
  expiry.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (Number.isNaN(diffDays)) return "";

  if (diffDays === 0) return "D - DAY";
  if (diffDays > 0) return `D - ${diffDays}`;
  return `D + ${Math.abs(diffDays)}`;
}

function getDdayNumber(expiryStr) {
  const norm = normalizeExpiryForCalc(expiryStr);
  if (!norm) return 999999; // 정렬용 기본값

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(norm);
  expiry.setHours(0, 0, 0, 0);

  const diffDays = Math.round((expiry - today) / (1000 * 60 * 60 * 24));
  if (Number.isNaN(diffDays)) return 999999;
  return diffDays;
}

function getDdayClass(expiryStr) {
  const diffDays = getDdayNumber(expiryStr);
  if (diffDays <= 0) return "dday dday-danger";
  if (diffDays <= 4) return "dday dday-warning";
  if (diffDays <= 10) return "dday dday-safe";
  return "dday";
}

// 계산용으로 정규화
function normalizeExpiryForCalc(expiry) {
  if (!expiry) return "";
  const s = String(expiry);
  const datePart = s.length >= 10 ? s.slice(0, 10) : s;
  return datePart.replace(/\./g, "-").replace(/\//g, "-");
}

// 화면 표시용
function formatExpiryDate(expiry) {
  if (!expiry) return "-";
  const s = String(expiry);
  const datePart = s.length >= 10 ? s.slice(0, 10) : s;
  return datePart.replace(/-/g, ".");
}

// 서버 응답 리스트 부분
function extractListFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
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
  // API에서 받은 목록
  const [items, setItems] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortMode, setSortMode] = useState("임박순"); // 임박순 | 이름순 | 등록순
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // 페이지가 열릴 때 GET /food 자동 호출
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
      console.log("GET /food 응답 원본:", data);

      const rawList = extractListFromResponse(data);

      // 서버 응답을 프론트에서 쓰기 편하게 정규화
      const normalized = rawList.map((item, idx) => {
        const rawExpiry =
          item.food_Ex ??
          item.expirationDate ??
          item.expiry ??
          item.expiryDate ??
          item.expiration_date ??
          item.food_expiry ??
          item.food_expiry_date ??
          "";

        const food_id = item.food_id ?? item.id ?? idx;
        const food_name =
          item.food_name ?? item.name ?? item.ingredientName ?? "";
        const food_category =
          item.food_category ?? item.category ?? item.type ?? "기타";

        return {
          food_id,
          food_name,
          food_category,
          expiry: normalizeExpiryForCalc(rawExpiry),
        };
      });

      setItems(normalized);
    } catch (err) {
      console.error("GET /food 오류:", err);
      setFetchError(err?.message ?? "목록을 불러오는 중 오류가 발생했습니다.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodList();
  }, []);

  // 필터 + 검색 + 정렬
  const filtered = useMemo(() => {
    let arr = [...items];

    // 카테고리 필터
    if (selectedCategory !== "전체") {
      arr = arr.filter((i) => i.food_category === selectedCategory);
    }

    // 검색어 필터
    const q = search.trim().toLowerCase();
    if (q) {
      arr = arr.filter(
        (i) =>
          i.food_name.toLowerCase().includes(q) ||
          i.food_category.toLowerCase().includes(q)
      );
    }

    // 정렬
    if (sortMode === "임박순") {
      arr.sort(
        (a, b) => getDdayNumber(a.expiry) - getDdayNumber(b.expiry)
      );
    } else if (sortMode === "이름순") {
      arr.sort((a, b) => a.food_name.localeCompare(b.food_name, "ko"));
    } else if (sortMode === "등록순") {
      arr.sort((a, b) => (b.food_id ?? 0) - (a.food_id ?? 0));
    }

    return arr;
  }, [items, selectedCategory, sortMode, search]);

  // 폐기 버튼 DELETE /food/discard/:food_id
  const handleDispose = async (id) => {
    const target = items.find(
      (i) => i.food_id === id || i.id === id
    );
    if (!target) return;

    const ok = window.confirm(`${target.food_name}을(를) 폐기 처리할까요?`);
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

  const handleAdd = () => {
    alert("새 식재료 추가 페이지로 이동 연결 예정!");
  };

  return (
    <div className="ingredients-list-page">
      <div className="ingredients-list-frame">
        <section className="saved-hero">
          <h1>Ingredients list</h1>
          <p>식품 목록</p>
        </section>

        <section className="list-body">
          {/* 카테고리 */}
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

          {/* 리스트 패널 */}
          <div className="list-panel">
            {/* 상단 툴바 */}
            <div className="list-toolbar">
              <div className="sort-group">
                {["임박순", "이름순", "등록순"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`sort-chip ${
                      sortMode === m ? "active" : ""
                    }`}
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
              {/* 로딩/에러 메시지 */}
              {loading && (
                <div className="empty-row" style={{ textAlign: "center" }}>
                  목록을 불러오는 중입니다...
                </div>
              )}
              {!loading && fetchError && (
                <div
                  className="empty-row"
                  style={{ textAlign: "center", color: "#e74c3c" }}
                >
                  {fetchError}
                </div>
              )}

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
                    <tr key={item.food_id}>
                      <td>{item.food_name}</td>
                      <td>{item.food_category}</td>
                      <td>{formatExpiryDate(item.expiry)}</td>
                      <td className={getDdayClass(item.expiry)}>
                        {getDday(item.expiry)}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="dispose-btn"
                          onClick={() => handleDispose(item.food_id)}
                        >
                          폐기
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!loading && filtered.length === 0 && (
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
