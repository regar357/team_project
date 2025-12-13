const pool = require("../config/db");
const { spawn } = require("child_process");
const path = require("path");
const { getExpiringFoods } = require("../utils/expiry");

/**
 * 이번 주 월요일 날짜 계산
 */
function getWeekStartDate() {
  const today = new Date();
  const day = today.getDay(); // 0=일, 1=월
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(today.setDate(diff)).toISOString().slice(0, 10);
}

exports.generateWeeklyRecipe = async (req, res) => {
  console.log("수신 성공");
  try {
    console.log("try...");
    const weekStart = getWeekStartDate();
    console.log("weekStart 계산 성공");
    // 유통기한 임박 식재료 조회
    const expiringFoods = await getExpiringFoods(13);
    console.log("식재료 조회");

    // 아무것도 없을 경우 안전장치
    if (expiringFoods.length === 0) {
      expiringFoods.push("기본 식재료");
    }

    // 이번 주 주간식단 조회
    const [rows] = await pool.query(
      `
      SELECT day_of_week, menu_title
      FROM weekly_meal_plan
      WHERE week_start = ?
      ORDER BY FIELD(day_of_week,'Mon','Tue','Wed','Thu','Fri','Sat','Sun')
      `,
      [weekStart]
    );
    console.log("주간식단 조회");

    // 이미 존재하면 바로 반환
    if (rows.length > 0) {
      console.log("주간 식단 조회 성공");
      return res.json({
        source: "db",
        week_start: weekStart,
        weekly_plan: groupByDay(rows),
      });
    }

    // 없으면 모델 호출
    const pythonProcess = spawn("python", [
      path.join(__dirname, "../../model/weekly_plan/weekly_plan.py"),
      JSON.stringify(expiringFoods),
    ]);

    let stdout = "";
    let stderr = "";

    pythonProcess.stdout.setEncoding("utf8");
    pythonProcess.stderr.setEncoding("utf8");
    console.log("모델 연동 중");

    pythonProcess.stdout.on("data", (data) => {
      stdout += data;
    });

    pythonProcess.stderr.on("data", (data) => {
      stderr += data;
      console.error("Python stderr:", data);
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        return res.status(500).json({
          error: "주간식단 모델 실행 실패",
          detail: stderr,
        });
      }
      console.log("모델 연동 성공");

      let parsed;
      try {
        parsed = JSON.parse(stdout);
      } catch (e) {
        return res.status(500).json({
          error: "모델 출력 JSON 파싱 실패",
          raw: stdout,
        });
      }

      const weeklyPlan = parsed.weekly_plan;

      // DB 저장
      const values = [];

      for (const [day, menus] of Object.entries(weeklyPlan)) {
        for (const menu of menus) {
          values.push([weekStart, day, menu.title]);
        }
      }

      await pool.query(
        `
        INSERT INTO weekly_meal_plan
        (week_start, day_of_week, menu_title)
        VALUES ?
        `,
        [values]
      );

      // 저장 후 반환
      res.json({
        source: "model",
        week_start: weekStart,
        weekly_plan: weeklyPlan,
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DB 결과 → 모델 출력 형태로 변환
 */
function groupByDay(rows) {
  return rows.reduce((acc, row) => {
    if (!acc[row.day_of_week]) acc[row.day_of_week] = [];
    acc[row.day_of_week].push({ title: row.menu_title });
    return acc;
  }, {});
}
