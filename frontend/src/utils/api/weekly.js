// // src/api/weekly.js


export async function fetchWeeklyPlan() {
    const API_ENDPOINT = `/weekly`;

    try {
        const response = await fetch(API_ENDPOINT);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`주간 식단 조회 실패: ${response.status} 상태 - ${errorText}`);
        }

        const data = await response.json();
        console.log("=== API 주간 식단 응답 데이터 (GET /weekly) ===");
        console.log(data);

        return data.weekly_plan || {};

    } catch (error) {
        console.error("주간 식단 API 호출 오류:", error);
        return {};
    }
}