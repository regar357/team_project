// utils/api/alerts.js

// 알림 더미 데이터
const dummyAlertHistory = [
  {
    alert_id: 1, 
    alert_date: "2025-11-26 10:00:00",
    alert_message: "계란의 유통기한이 D-1 남았습니다.", 
  },
  {
    alert_id: 2,
    alert_date: "2025-11-26 11:30:00",
    alert_message: "우유의 유통기한이 D-2 남았습니다.",
  },
  {
    alert_id: 3,
    alert_date: "2025-11-25 09:00:00",
    alert_message: "빵의 유통기한이 D-1 남았습니다.",
  },
  {
    alert_id: 4,
    alert_date: "2025-11-20 15:00:00",
    alert_message: "토마토의 유통기한이 D-3 남았습니다.",
  },
  {
    alert_id: 5,
    alert_date: "2025-11-18 17:00:00",
    alert_message: "양파의 유통기한이 D-2 남았습니다.",
  },
];


// // ==== 실제 API 대신 더미 데이터 반환 ====
// export async function fetchAlertHistory() {
//   console.log("[DUMMY] fetchAlertHistory 호출됨");
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(dummyAlertHistory), 300); // 약간의 로딩 느낌
//   });
// }

// // ==== 알림 생성도 더미 처리 ====
// export async function createAlert(message, date) {
//   console.log("[DUMMY] createAlert 호출됨:");
//   console.log("message:", message);
//   console.log("date:", date);

//   return new Promise((resolve) => {
//     setTimeout(() => resolve(true), 300);
//   });
// }


/* API 연동 */
export async function fetchAlertHistory() {
    const API_ENDPOINT = "/alerts"; 
    
    console.log(`[API GET] ${API_ENDPOINT} 요청 시작`); 
    
    try {
        const response = await fetch(API_ENDPOINT);

        if (!response.ok) {
            console.error(`[API GET] ${API_ENDPOINT} 응답 실패: 상태 ${response.status}`); 
            throw new Error(`알림 기록 조회 실패: ${response.status} 상태`);
        }

        const data = await response.json();
        console.log("[fetchAlertHistory] raw response:", data);

        
        if (Array.isArray(data)) return data;

        if (data && Array.isArray(data.alerts)) return data.alerts;

        if (data && Array.isArray(data.data)) return data.data;

        console.warn("[fetchAlertHistory] API 응답이 배열 형태가 아닙니다:", data);
        return [];

    } catch (error) {
        console.error("[fetchAlertHistory] 오류:", error);
        return [];
    }
}

/* API 알림 생성 */
export async function createAlert(message, date) {
    const API_ENDPOINT = "/alerts/create";
    
    const payload = {
        alert_date: date,          
        alert_message: message,    
    };

    console.log(`[API POST] 알림 생성 요청 데이터:`, payload);

    const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `알림 생성 실패: ${response.status}`);
    }

    return await response.json();
}