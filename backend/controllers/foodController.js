const pool = require("../config/db");
const { spawn } = require("child_process");
const path = require("path");

exports.uploadFood = async (req, res) => {
  const imagePath = req.file.path; //  uploads/이미지파일
  console.log("사진 경로: " + imagePath);

  res.json({
    message: "사진 업로드 성공",
    imagePath: imagePath,
  });

  // try {
  //   const pythonProcess = spawn("python", [
  //     path.join(__dirname, "../../model/yolo/yolo_model.py"),
  //     imagePath,
  //   ]);

  //   let output = "";
  //   pythonProcess.stdout.on("data", (data) => {
  //     output += data.toString();
  //   });

  //   pythonProcess.on("close", async () => {
  //     const result = JSON.parse(output); // { items: [{name, category, count}, ...] }
  //     const items = result.items;

  //     const finalResults = [];

  //     for (const item of items) {
  //       const { name, category, count } = item;

  //       const [expRows] = await pool.query(
  //         "SELECT expiration_days FROM expiration_mapping WHERE food_name = ?",
  //         [name]
  //       );

  //       const expirationDays = expRows.length
  //         ? expRows[0].expiration_days
  //         : null;

  //       let expirationDate = null;
  //       if (expirationDays) {
  //         expirationDate = new Date();
  //         expirationDate.setDate(expirationDate.getDate() + expirationDays);

  //         await pool.query(
  //           "INSERT INTO food (food_name, category, expiration_date, food_count) VALUES (?, ?, ?, ?)",
  //           [name, category, expirationDate, count]
  //         );
  //       }

  //       finalResults.push({
  //         name,
  //         category,
  //         expirationDays,
  //         expirationDate,
  //         count,
  //       });
  //     }

  //     res.json({
  //       message: "등록 완료",
  //       results: finalResults,
  //     });
  //   });
  // } catch (err) {
  //   res.status(500).json({ error: err.message });
  // }
};

exports.updateFood = async (req, res) => {
  const { food_id } = req.params;
  const { food_name, food_category, food_Ex } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE food SET food_name = ?, food_category = ?, food_Ex = ? WHERE id = ?",
      [food_name, food_category, food_Ex, food_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "존재하지 않는 식품 ID" });
    }

    res.json({
      message: "수정 완료",
      food_id,
      food_name,
      food_category,
      food_Ex,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFoodList = async (req, res) => {
  const { sort } = req.query;

  let query = "SELECT * FROM food";

  //정렬 조건
  if (sort == "name") {
    query += "ORDER BY food_name ASC"; //이름으로 오름차순 정렬.
  } else if (sort === "date") {
    query += "ORDER BY id DESC"; //최근 등록순. id로 내림차순
  } else {
    query += "ORDER BY id ASC"; //기본 등록순.
  }

  try {
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.discardFood = async (req, res) => {
  const { food_id } = req.params;

  try {
    const [rows] = await pool.query("SELECT * FROM food WHERE food_id = ?", [
      food_id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "식품 정보를 찾을 수 없음" });
    }

    const food = rows[0];

    await pool.query(
      "INSERT INTO discarded_food (food_id, food_name, food_category, food_Ex, discard_date) VALUES (?, ?, ?, ?, NOW())",
      [food.food_id, food.food_name, food.food_category, food.food_Ex]
    );

    await pool.query("DELETE FROM food WHERE food_id = ?", [food_id]);

    res.status(200).json({ message: "식품 폐기 완료" });
  } catch (err) {
    res.status(500).json({ message: "DB 처리 중 오류 발생", error: err });
  }
};
