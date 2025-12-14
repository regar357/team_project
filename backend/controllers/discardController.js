const pool = require("../config/db");

exports.getDiscard = async (req, res) => {
  console.log("수신 성공");

  // res.json({
  //   meseage: "API 통신 성공",
  // });

  const query = "SELECT * FROM discarded_food";

  try {
    const [rows] = await pool.query(query);

    if (rows.length === 0) {
      return res.json({
        message: "폐기량 정보 없음",
      });
    }

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
