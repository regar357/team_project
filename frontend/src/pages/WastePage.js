import React, { useEffect, useMemo, useState } from "react";
import "./WastePage.css";

// 요약 계산 함수
function calcSummary(data) {
  const totalItems = data.length;
  const totalAmount = data.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

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
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error(`GET /discard 실패 (${res.status})`);
      }

      const data = await res.json().catch(() => []);

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];


      // discard_id    폐기 테이블 인덱스
      // food_id       식재료 테이블 인덱스
      // food_name     식재료명
      // food_category 카테고리
      // food_Ex       유통기한
      // discard_date  폐기일
      const normalized = list.map((item, idx) => ({
        discard_id: item.discard_id ?? idx,
        food_id: item.food_id ?? null,
        name: item.food_name ?? "",
        category: item.food_category ?? "기타",
        expiry: item.food_Ex ?? "", // 필요 시 사용 가능
        discardDate: item.discard_date ?? "",

        amount:
          item.amount ??
          item.discard_amount ??
          item.count ??
          item.qty ??
          0,
      }));

      setWasteData(normalized);

      console.log("GET /discard 응답 수신:", normalized);
    } catch (err) {
      setError(err?.message ?? "폐기량 데이터를 불러오지 못했습니다.");
      console.log("GET /discard 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 폐기 기록 삭제 DELETE /food/discard/:food_id
  const handleDeleteRecord = async (foodId) => {
    if (!foodId && foodId !== 0) {
      alert("food_id 정보가 없습니다. 서버 응답 형식을 확인하세요.");
      return;
    }

    const target = wasteData.find((item) => item.food_id === foodId);
    const name = target?.name || "해당 식재료";

    const ok = window.confirm(`${name}의 폐기 기록을 삭제하시겠습니까?`);
    if (!ok) return;

    try {
      const res = await fetch(`/food/discard/${foodId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`DELETE /food/discard 실패 (${res.status})`);
      }

      const data = await res.json().catch(() => ({}));
      console.log("DELETE /food/discard 응답:", data);

      // 화면에서도 해당 기록 제거
      setWasteData((prev) =>
        prev.filter((item) => item.food_id !== foodId)
      );
    } catch (err) {
      console.log("DELETE /food/discard 오류:", err);
      alert(err?.message ?? "폐기 기록 삭제 중 오류가 발생했습니다.");
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
    <div className="waste-page">
      <div className="waste-inner">
        <section className="header-hero">
          <h1>Waste list</h1>
          <p>폐기 목록</p>
        </section>

        <section className="waste-top-card">
          {/* 로딩/에러 표시 */}
          {loading && (
            <div className="waste-empty">데이터 불러오는 중...</div>
          )}
          {!loading && error && (
            <div className="waste-empty waste-error">{error}</div>
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

            <div className="waste-toolbar-buttons">
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
        </section>

        {/* 폐기 목록 테이블 */}
        <section className="waste-list-card">
          <div className="waste-table-wrapper">
            <table className="waste-table">
              <thead>
                <tr>
                  <th>식재료명</th>
                  <th>카테고리</th>
                  <th>폐기일</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  !error &&
                  filteredData.map((item, idx) => (
                    <tr
                      key={item.discard_id ?? `${item.food_id ?? "item"}-${idx}`}
                    >
                      <td>{item.name || "-"}</td>
                      <td>{item.category || "-"}</td>
                      <td>
                        {item.discardDate
                          ? String(item.discardDate)
                              .slice(0, 10)
                              .replace(/-/g, ".")
                          : "-"}
                      </td>
                      <td>{item.amount ?? 0}</td>
                      <td>
                        <button
                          type="button"
                          className="waste-reset-btn"
                          onClick={() => handleDeleteRecord(item.food_id)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}

                {!loading && !error && filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="waste-empty">
                      선택한 조건에 해당하는 폐기 내역이 없습니다.
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

export default WastePage;
