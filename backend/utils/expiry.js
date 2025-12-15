const pool = require("../config/db");
// utils/expiry.js
exports.getExpiringFoods = async (days = 3) => {
  console.log("getExpiringFoods 진입");
  console.log("days:", days, typeof days);
  const [rows] = await pool.query(
    `
    SELECT food_name
    FROM food
    WHERE food_Ex BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
    `,
    [days]
  );
  console.log("식재료 조회 성공");

  return rows.map((row) => row.food_name);
};
