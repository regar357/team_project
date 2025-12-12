const pool = require("../config/db");

exports.getAlerts = async (req, res) => {
  console.log("알림 기록 조회 수신 성공");

  const query = "SELECT * FROM expiry_alert_log ORDER BY alert_date DESC";

  try {
    const [rows] = await pool.query(query);

    return res.json({
      message: "알림 기록 조회 성공",
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAlerts = async (req, res) => {
  console.log("알림 생성 수신 성공");

  const { alert_message } = req.body;

  // 같은 메시지로 오늘 알림이 이미 생성되었는지 확인
  const checkQuery = `
    SELECT id 
    FROM expiry_alert_log
    WHERE alert_message = ?
      AND DATE(alert_date) = CURDATE()
    LIMIT 1
  `;

  // 새 알림 추가 쿼리
  const insertQuery = `
    INSERT INTO expiry_alert_log (alert_date, alert_message)
    VALUES (NOW(), ?)
  `;

  try {
    const [existing] = await pool.query(checkQuery, [alert_message]);

    // 이미 존재하면 INSERT 안함
    if (existing.length > 0) {
      return res.json({
        message: "중복된 알림이 오늘 이미 존재함 → 생성 스킵",
      });
    }

    // 없으면 알림 생성
    await pool.query(insertQuery, [alert_message]);

    return res.json({
      message: "알림 기록 저장 성공",
    });
  } catch (err) {
    console.error("알림 생성 오류:", err);
    return res.status(500).json({ error: err.message });
  }
};
