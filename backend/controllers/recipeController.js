const pool = require("../config/db");
const { spawn } = require("child_process");
const path = require("path");

exports.generateRecipe = async (req, res) => {
  const ingredients = req.body.ingredients; // ["계란","우유","파스타"]

  try {
    const pythonProcess = spawn("python", [
      path.join(__dirname, "../../model/레시피 추천 모델 경로"),
      JSON.stringify(ingredients),
    ]);

    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.log("Python Error:", data.toString());
    });

    pythonProcess.on("close", async () => {
      const result = JSON.parse(output);

      const {
        title,
        description,
        priority_used_ingredients,
        other_ingredients,
        servings,
        steps,
        tips,
      } = result;

      // DB 저장
      await pool.query(
        `INSERT INTO recipe 
        (recipe_title, recipe_description, priority_used_ingredients, other_ingredients, servings, recipe_steps, recipe_tips) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description,
          JSON.stringify(priority_used_ingredients),
          JSON.stringify(other_ingredients),
          servings,
          JSON.stringify(steps), // LONGTEXT로 JSON 저장
          JSON.stringify(tips),
        ]
      );

      res.json({
        message: "레시피 생성 완료",
        recipe: result,
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecipeList = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT recipe_id, recipe_title, recipe_description, priority_used_ingredients,
             other_ingredients, servings, recipe_steps, recipe_tips, created_at
      FROM recipe
      ORDER BY created_at DESC
    `);

    res.json({
      message: "레시피 목록 조회 성공",
      recipes: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "레시피 조회 실패" });
  }
};

exports.deleteRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM recipe WHERE recipe_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "삭제할 레시피가 없습니다." });
    }

    return res.json({ message: "레시피 삭제 성공" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "레시피 삭제 실패" });
  }
};
