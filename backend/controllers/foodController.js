const pool = require("../config/db");
const { spawn } = require("child_process");
const path = require("path");

exports.uploadFood = async (req, res) => {
  const imagePath = path.resolve(req.file.path); //  uploads/이미지파일
  console.log("사진 경로: " + imagePath);

  // res.json({
  //   message: "사진 업로드 성공",
  //   imagePath: imagePath,
  // });

  try {
    const pythonProcess = spawn(
      "python",
      [path.join(__dirname, "../../model/food_detection/detect.py"), imagePath],
      {
        encoding: "utf-8",
      }
    );

    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString("utf-8");
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python stderr:", data.toString());
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: "모델 실행 실패" });
      }
      const result = JSON.parse(output); // { items: [{name, category, count}, ...] }
      console.log("모델 결과: ", result);
      const items = result.items;

      const finalResults = [];

      for (const item of items) {
        const { name, category, count } = item;

        const [expRows] = await pool.query(
          "SELECT default_Ex FROM expiration_mapping WHERE food_category = ?",
          [category]
        );

        const expirationDays = expRows.length ? expRows[0].default_Ex : null;

        let expirationDate = null;
        if (expirationDays) {
          expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + expirationDays);
        }

        const [insertResult] = await pool.query(
          "INSERT INTO food (food_name, food_category, food_Ex, food_count) VALUES (?, ?, ?, ?)",
          [name, category, expirationDate, count]
        );

        const insertedId = insertResult.insertId;

        finalResults.push({
          food_id: insertedId,
          name,
          category,
          expirationDays,
          expirationDate,
          count,
        });
      }

      res.json({
        message: "등록 완료",
        results: finalResults,
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFood = async (req, res) => {
  console.log("식재료 수정 수신 성공");
  const { food_id } = req.params;
  const { name, category, expiry } = req.body;
  console.log("food_id: " + food_id);
  console.log(req.body);

  try {
    console.log("트라이 시작");
    const [result] = await pool.query(
      "UPDATE food SET food_name = ?, food_category = ?, food_Ex = ? WHERE food_id = ?",
      [name, category, expiry, food_id]
    );

    console.log("수정 완료");

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "존재하지 않는 식품 ID" });
    }

    res.json({
      message: "수정 완료",
      food_id,
      name,
      category,
      expiry,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFoodList = async (req, res) => {
  console.log("수신 성공");

  const query = "SELECT * FROM food";

  try {
    const [rows] = await pool.query(query);

    res.json({
      message: "식재료 리스트 출력",
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getFoodNameList = async (req, res) => {
  console.log("수신 성공");

  const query = "SELECT food_name FROM food";

  try {
    const [rows] = await pool.query(query);

    res.json({
      message: "식재료 이름 리스트 출력",
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.discardFood = async (req, res) => {
  const { food_id } = req.params;
  console.log("수신 성공: " + food_id);

  // res.json({
  //   message: "폐기 처분 성공",
  // });

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
