// src/pages/ExpireAlert.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import { fetchAlertHistory } from "../utils/api/alerts";
import "./ExpireAlert.css";

const ExpireAlert = () => {
  const navigate = useNavigate();

  // 알림 온/오프
  const [enabled, setEnabled] = useState(true);

  // 선택된 시점 (D-3 / D-2 / D-day)
  const [timing, setTiming] = useState("D-3");
  
  
  // 알림 기록 상태
  const [history, setHistory] = useState([]);

  React.useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchAlertHistory();
        setHistory(data);
      } catch (e) {
        console.error("알림 기록 불러오기 실패:", e);
      }
    };
    loadHistory();
  }, []);

  // // 더미 알림 기록
  // const history = [
  //   { date: "2025.11.26", text: "2개의 식품 알림 전송" },
  //   { date: "2025.11.25", text: "1개의 식품 알림 전송" },
  //   { date: "2025.11.20", text: "3개의 식품 알림 전송" },
  //   { date: "2025.11.18", text: "1개의 식품 알림 전송" },
  // ];

  return (
    <div className="alert-page">
      {/* 상단 헤더 */}
      <header className="alert-header">
        <button
          className="alert-back-btn"
          type="button"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        <h1 className="alert-title">유통기한 알림</h1>
      </header>

      <main className="alert-main">
        {/* 알림 수신 설정 */}
        <Card className="alert-card">
          <div className="alert-row">
            <div className="alert-icon-circle">
              <span className="alert-icon">🔔</span>
            </div>
            <div className="alert-texts">
              <div className="alert-card-title">알림 수신 설정</div>
              <p className="alert-card-desc">
                식재료 만료일에 대한 알림을 받을지 선택해주세요
              </p>
            </div>
            <button
              type="button"
              className={`alert-toggle ${enabled ? "on" : ""}`}
              onClick={() => setEnabled((prev) => !prev)}
            >
              <span className="alert-toggle-knob" />
            </button>
          </div>
        </Card>

        {/* 알림 받을 시점 선택 */}
        <Card className="alert-card">
          <div className="alert-row alert-row-column">
            <div className="alert-row">
              <div className="alert-icon-circle">
                <span className="alert-icon">📅</span>
              </div>
              <div className="alert-texts">
                <div className="alert-card-title">알림 받을 시점 선택</div>
                <p className="alert-card-desc">
                  식재료가 만료되기 전에 미리 알려드립니다
                </p>
              </div>
            </div>

            <div className="alert-radio-group">
              <label className="alert-radio">
                <input
                  type="radio"
                  name="alertTiming"
                  value="D-3"
                  checked={timing === "D-3"}
                  onChange={(e) => setTiming(e.target.value)}
                />
                <span className="alert-radio-mark" />
                <span className="alert-radio-label">
                  D-3 <span className="alert-radio-sub">(만료 3일 전)</span>
                </span>
              </label>

              <label className="alert-radio">
                <input
                  type="radio"
                  name="alertTiming"
                  value="D-2"
                  checked={timing === "D-2"}
                  onChange={(e) => setTiming(e.target.value)}
                />
                <span className="alert-radio-mark" />
                <span className="alert-radio-label">
                  D-2 <span className="alert-radio-sub">(만료 2일 전)</span>
                </span>
              </label>

              <label className="alert-radio">
                <input
                  type="radio"
                  name="alertTiming"
                  value="D-day"
                  checked={timing === "D-day"}
                  onChange={(e) => setTiming(e.target.value)}
                />
                <span className="alert-radio-mark" />
                <span className="alert-radio-label">
                  당일 <span className="alert-radio-sub">(만료일 당일)</span>
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* 알림 기록 보기 */}
        <Card className="alert-card alert-log-card">
          <div className="alert-log-header">알림 기록 보기</div>
          <div className="alert-log-divider" />

          <ul className="alert-log-list">
            {history.map((item) => (
              <li key={item.id} className="alert-log-item">
                <span className="alert-log-date">{item.sentAt}</span>
                <span className="alert-log-text">{item.ingredientName}
                  <span className="alert-log-dday">{item.dday}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </main>
    </div>
  );
};

export default ExpireAlert;
