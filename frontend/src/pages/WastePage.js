// src/WastePage.js
import React, { useEffect, useMemo, useState } from "react";
import "./WastePage.css";

// 요약 계산 함수
function calcSummary(data) {
  const totalItems = data.length;
  const totalAmount = data.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const categoryMap = data.reduce((map, item) => {
    const cat = item.category || "기타";
    map[cat] = (map[cat] || 0) + (Number(item.amount) || 0);
    return map;
  }, {});

  let topCategory = "-";
  let topAmount = 0;
  Object.entries(categoryMap).forEach(([category, amount]) => {
    if (amount > topAmount) {
      topAmount = amount;
      topCategory = category;
    }
  });

  return { totalItems, totalAmount, topCategory };
}

function WastePage() {
  // 필터 상태
  const [categoryFilter, setCategoryFilter] = useState("전체");

  // 서버 데이터 상태
  const [wasteData, setWasteData] = useState([]);

  // 통신 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // GET /discard 호출
  const fetchDiscard = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/discard", {
        method: "GET",
        headers: { "Accept": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`GET /discard 실패 (${res.status})`);
      }

      const data = await res.json().catch(() => []);

      // 혹시 백엔드가 { data: [...] } 형태로 줄 수도 있어서 대응
      const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);

      // 필드명 표준화(백엔드 키가 달라도 최대한 안전하게)
      const normalized = list.map((item) => ({
        name: item.name ?? item.foodName ?? item.ingredientName ?? "",
        category: item.category ?? item.type ?? "",
        disposeDate: item.disposeDate ?? item.discardDate ?? item.date ?? "",
        amount: item.amount ?? item.count ?? item.qty ?? 0,
      }));

      setWasteData(normalized);

      // 통신 확인 로그(브라우저 콘솔)
      console.log("GET /discard 응답 수신:", normalized);
    } catch (err) {
      setError(err?.message ?? "폐기량 데이터를 불러오지 못했습니다.");
      console.log("GET /discard 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 최초 진입 시 자동 호출
  useEffect(() => {
    fetchDiscard();
  }, []);

  // 필터링
  const filteredData = useMemo(() => {
    if (categoryFilter === "전체") return wasteData;
    return wasteData.filter((item) => item.category === categoryFilter);
  }, [wasteData, categoryFilter]);

  // 요약
  const { totalItems, totalAmount, topCategory } = useMemo(
    () => calcSummary(filteredData),
    [filteredData]
  );

  return (
    <div className="page">
      <div className="frame">
        {/* 아래 내용 영역 */}
        <main className="waste-content">
          {/* 로딩/에러 표시 */}
          {loading && (
            <div className="waste-empty">데이터 불러오는 중...</div>
          )}

          {!loading && error && (
            <div className="waste-empty" style={{ color: "#e74c3c" }}>
              {error}
            </div>
          )}

          {/* 필터 영역 */}
          <div className="waste-toolbar">
            <div className="filter-group">
              <label htmlFor="categoryFilter">카테고리</label>
              <select
                id="categoryFilter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="전체">전체</option>
                <option value="채소">채소</option>
                <option value="과일">과일</option>
                <option value="해산물">해산물</option>
                <option value="유제품">유제품</option>
                <option value="가공식품">가공식품</option>
                <option value="육류">육류</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="waste-reset-btn"
                onClick={() => setCategoryFilter("전체")}
              >
                필터 초기화
              </button>

              {/* 통신 재확인 버튼 */}
              <button
                type="button"
                className="waste-reset-btn"
                onClick={fetchDiscard}
              >
                새로고침
              </button>
            </div>
          </div>

          {/* 요약 카드 3개 */}
          <div className="waste-summary">
            <div className="summary-card">
              <div className="summary-label">총 폐기 횟수</div>
              <div className="summary-value">{totalItems} 회</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">총 폐기 개수</div>
              <div className="summary-value">{totalAmount} 개</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">가장 많이 버린 카테고리</div>
              <div className="summary-value">{topCategory}</div>
            </div>
          </div>

          {/* 폐기 목록 테이블 */}
          <div className="waste-table-wrapper">
            <table className="waste-table">
              <thead>
                <tr>
                  <th>식재료명</th>
                  <th>카테고리</th>
                  <th>폐기일</th>
                  <th>폐기량(개)</th>
                </tr>
              </thead>
              <tbody>
                {!loading && !error && filteredData.map((item, idx) => (
                  <tr key={`${item.name || "item"}-${idx}`}>
                    <td>{item.name || "-"}</td>
                    <td>{item.category || "-"}</td>
                    <td>
                      {item.disposeDate
                        ? String(item.disposeDate).replace(/-/g, ".")
                        : "-"}
                    </td>
                    <td>{item.amount ?? 0}</td>
                  </tr>
                ))}

                {!loading && !error && filteredData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="waste-empty">
                      선택한 조건에 해당하는 폐기 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default WastePage;
