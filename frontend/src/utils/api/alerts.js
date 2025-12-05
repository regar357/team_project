// utils/api/alerts.js

// 알림 기록 더미 데이터
// 필드: id, sentAt(발송일), ingredientName(식재료명), dday(D-n)
const dummyAlertHistory = [
  {
    id: 1,
    sentAt: "2025.11.26",
    ingredientName: "계란",
    dday: "D-1",
  },
  {
    id: 2,
    sentAt: "2025.11.26",
    ingredientName: "우유",
    dday: "D-2",
  },
  {
    id: 3,
    sentAt: "2025.11.25",
    ingredientName: "빵",
    dday: "D-1",
  },
  {
    id: 4,
    sentAt: "2025.11.20",
    ingredientName: "토마토",
    dday: "D-3",
  },
  {
    id: 5,
    sentAt: "2025.11.18",
    ingredientName: "양파",
    dday: "D-2",
  },
];

export async function fetchAlertHistory() {
  // 백엔드 연동 시:
  // const res = await fetch("/api/alerts/history");
  // return res.json();

  await new Promise((r) => setTimeout(r, 150)); 
  return dummyAlertHistory;
}
