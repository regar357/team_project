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
