const pool = require("../config/db");

exports.getAlerts = async (req, res) => {
  console.log("수신 성공");

  res.json({
    message: "알림 기록 송신",
  });

  // const query = "SELECT * FROM expiry_alert_log";

  // try {
  //   const [rows] = await pool.query(query);

  //   if (rows.length === 0) {
  //     return res.json({
  //       message: "알림 기록 없음",
  //     });
  //   }

  //   res.json(rows);
  // } catch (err) {
  //   res.status(500).json({ error: err.message });
  // }
};

exports.createAlerts = async (req, res) => {};
