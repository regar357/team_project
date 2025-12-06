// src/WastePage.js
import React, { useState } from "react";
import "./WastePage.css";

// 데이터베이스로 연결될거라 지워도 됩니다. 시각화용
const wasteData = [
  { name: "가지", category: "채소", disposeDate: "2025-11-30", amount: 1 },
  { name: "사과", category: "과일", disposeDate: "2025-11-30", amount: 2 },
];

function calcSummary(data) {
  const totalItems = data.length;
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  const categoryMap = data.reduce((map, item) => {
    map[item.category] = (map[item.category] || 0) + item.amount;
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
  const [categoryFilter, setCategoryFilter] = useState("전체");

  const filteredData =
    categoryFilter === "전체"
      ? wasteData
      : wasteData.filter((item) => item.category === categoryFilter);

  const { totalItems, totalAmount, topCategory } = calcSummary(filteredData);

  return (
    <div className="page">

      {/* 가운데 흰색 카드 프레임 */}
      <div className="frame">
        {/* 상단 흰색 헤더 */}


        {/* 오렌지색 WASTE 영역 */}
        <section className="waste-hero">
          <h1 className="waste-title">WASTE</h1>
          <p className="waste-subtitle">폐기량 / 조회</p>
        </section>

        {/* 아래 내용 영역 */}
        <main className="waste-content">
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

            <button
              type="button"
              className="waste-reset-btn"
              onClick={() => setCategoryFilter("전체")}
            >
              필터 초기화
            </button>
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
                {filteredData.map((item, idx) => (
                  <tr key={`${item.name}-${idx}`}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.disposeDate.replace(/-/g, ".")}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
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
