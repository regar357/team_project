// utils/api/alerts.js

// // 알림 기록 더미 데이터
// // 필드: id, sentAt(발송일), ingredientName(식재료명), dday(D-n)
// const dummyAlertHistory = [
//   {
//     id: 1,
//     sentAt: "2025.11.26",
//     message: "계란",
//     dday: "D-1",
//   },
//   {
//     id: 2,
//     sentAt: "2025.11.26",
//     ingredientName: "우유",
//     dday: "D-2",
//   },
//   {
//     id: 3,
//     sentAt: "2025.11.25",
//     ingredientName: "빵",
//     dday: "D-1",
//   },
//   {
//     id: 4,
//     sentAt: "2025.11.20",
//     ingredientName: "토마토",
//     dday: "D-3",
//   },
//   {
//     id: 5,
//     sentAt: "2025.11.18",
//     ingredientName: "양파",
//     dday: "D-2",
//   },
// ];

// export async function fetchAlertHistory() {
//   // 백엔드 연동 시:
//   // const res = await fetch("/api/alerts/history");
//   // return res.json();

//   await new Promise((r) => setTimeout(r, 150)); 
//   return dummyAlertHistory;
// }


// 알림 기록 더미 데이터
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

        const rawAlerts = await response.json();
        
        console.log(`[API GET] ${API_ENDPOINT} 응답 성공:`, rawAlerts); 

        if (!Array.isArray(rawAlerts)) {
             console.warn("API 응답 형식이 배열이 아닙니다.");
             return [];
        }
        return rawAlerts;

    } catch (error) {
        console.error(`[API GET] ${API_ENDPOINT} 처리 중 오류 발생:`, error);         
        return [];
    }
}