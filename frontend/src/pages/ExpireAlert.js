// src/pages/ExpireAlert.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import { fetchAlertHistory, createAlert } from "../utils/api/alerts";
import "./ExpireAlert.css";

// "D-3" / "D-2" / "D-day" → 숫자(3, 2, 0)로 변환
const timingStringToDays = (timingString) => {
  if (timingString === "D-day") return 0;
  return parseInt(timingString.replace("D-", ""), 10);
};

function parseDateOnly(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/* 알림 날짜 계산 */
function calculateAlertDate(expirationDateString, daysBefore) {
    const expiryDate = parseDateOnly(expirationDateString);
    expiryDate.setDate(expiryDate.getDate() - daysBefore); 
    expiryDate.setHours(10, 0, 0, 0);

    const pad = (num) => num.toString().padStart(2, '0'); 
    
     return `${expiryDate.getFullYear()}-${pad(
        expiryDate.getMonth() + 1
        )}-${pad(expiryDate.getDate())} ${pad(
        expiryDate.getHours()
        )}:${pad(expiryDate.getMinutes())}:${pad(expiryDate.getSeconds())}`;

  }

// 알림 생성 API 호출 핸들러
async function handleUserAlertSetting(ingredientName, expirationDate, daysBefore) {
    const ddayText = daysBefore === 0 ? "D-day" : `D-${daysBefore}`;
    const message = `${ingredientName}의 유통기한이 ${ddayText} 남았습니다. (${expirationDate})`;
    const alertDateString = calculateAlertDate(expirationDate, daysBefore);

    console.log(`[${ingredientName}] 최종 알림 시점: ${alertDateString}`);

    const success = await createAlert(message, alertDateString);

    if (success) {
        console.log("알림 설정이 완료되었습니다.");
        return true;
    } else {
        console.error("알림 설정 실패.");
        return false;
    }
}

// ----------------- [ REACT COMPONENT ] -----------------

const ExpireAlert = () => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(true);
  const [timing, setTiming] = useState("D-3");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false); 

  // 임시 더미 데이터
  const DUMMY_FOOD_ITEM = { name: "양파", expiry: "2026-01-20" };
  
  // 알림 기록 
  const loadHistory = async () => {
        setLoading(true);
        try {
            const rawData = await fetchAlertHistory();
            
            const normalizedHistory = rawData.map(item => {
              const id = item.alert_id ?? item.id;
              const alertDate = item.alert_date ?? item.date ?? "";
              const msg = item.alert_message ?? item.message ?? "";

              const sentAt = alertDate ? String(alertDate).split(" ")[0].split("T")[0]: "날짜 미정";

              const ddayMatch = msg.match(/D-(\d+|day)/);

              return {id, sentAt, message:msg, dday: ddayMatch ? ddayMatch[0] : "",};
          });
            
            setHistory(normalizedHistory);

        } catch (e) {
            console.error("알림 기록 불러오기 실패:", e);
        } finally {
            setLoading(false);
        }
  };

  // 자동 저장 핸들러 함수 (API 호출 및 상태 업데이트)
  const handleAutoSave = async (newTiming) => {
        if (!enabled) {
            console.warn("알림 수신이 비활성화되어 자동 저장을 건너뜁니다.");
            return;
        }
        setTiming(newTiming); 

        const days = timingStringToDays(newTiming);


        const success = await handleUserAlertSetting(
            DUMMY_FOOD_ITEM.name, 
            DUMMY_FOOD_ITEM.expiry, 
            days
        );
        
    if (success) {
            console.log(`알림 시점 설정 완료`);
            await loadHistory(); 
    } else {
            console.error("자동 저장 실패. 이전 설정으로 되돌립니다.");
        }
    };


    
    useEffect(() => {
        loadHistory();
    }, []);



  return (
    <div className="alert-page">
      {/* 상단 헤더 */}
      <header className="alert-header">
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
              <label className={`alert-radio ${!enabled ? "disabled" : ""}`}>
                <input
                  type="radio"
                  name="alertTiming"
                  value="D-3"
                  checked={timing === "D-3"}
                  onChange={(e) => handleAutoSave(e.target.value)}

                />
                <span className="alert-radio-mark" />
                <span className="alert-radio-label">
                  D-3 <span className="alert-radio-sub">(만료 3일 전)</span>
                </span>
              </label>

              <label className={`alert-radio ${!enabled ? "disabled" : ""}`}>
                <input
                  type="radio"
                  name="alertTiming"
                  value="D-2"
                  checked={timing === "D-2"}
                  onChange={(e) => handleAutoSave(e.target.value)}
                />
                <span className="alert-radio-mark" />
                <span className="alert-radio-label">
                  D-2 <span className="alert-radio-sub">(만료 2일 전)</span>
                </span>
              </label>

              <label className={`alert-radio ${!enabled ? "disabled" : ""}`}>
                <input
                  type="radio"
                  name="alertTiming"
                  value="D-day"
                  checked={timing === "D-day"}
                  onChange={(e) => handleAutoSave(e.target.value)}
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
          {loading && <p className="alert-loading-text">기록을 불러오는 중...</p>}
          <ul className="alert-log-list">
            {history.length === 0 && !loading && <li className="alert-log-empty">알림 기록이 없습니다.</li>}
            {history.map((item) => (
              <li key={item.id} className="alert-log-item">
                <span className="alert-log-date">{item.sentAt}</span>
                <span className="alert-log-text">{item.message}
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
