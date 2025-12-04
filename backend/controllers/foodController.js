const pool = require("../config/db");
const { spawn } = require("child_process");
const path = require("path");

exports.uploadFood = async (req, res) => {
  const imagePath = req.file.path; //  uploads/이미지파일

  try {
    //model 폴더의 YOLO모델 실행
    const pythonProcess = spawn("python", [
      path.join(__dirname, "YOLO모델 경로"), //상대경로
      path.join(__dirname, "../" + imagePath), //파일 경로 전달
    ]);

    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.tostring();
    });

    pythonProcess.on("close", async () => {
      const result = JSON.parse(output);
      const { name, category } = result;

      //유통기한 매핑
      const [expirationRows] = await pool.query(
        "SELECT default_Ex FROM expiration_mapping WHERE food_name = ?",
        [name]
      );

      if (expirationRows.length === 0) {
        return res.status(404).json({ message: "유통기한 데이터 없음" });
      }

      const expirationDays = expirationRows[0].default_Ex;

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + expirationDays);

      //식품 테이블로 저장
      await pool.query(
        "INSERT INTO food (food_name, food_category, food_Ex) VALUES (?, ?, ?)",
        [name, category, expirationDate]
      );

      //JSON 프론트로 전달
      res.json({
        message: "저장 완료",
        name,
        category,
        expirationDate,
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
