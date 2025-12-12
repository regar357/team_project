const pool = require("../config/db");
const { spawn } = require("child_process");
const path = require("path");

exports.generateRecipe = async (req, res) => {
  const ingredients = req.body.ingredients;

  console.log("전달받은 식재료:", ingredients);

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "ingredients 배열이 필요합니다." });
  }

  const scriptPath = path.join(
    __dirname,
    "../../model/rag_recipe/rag_recipe.py"
  );
  const argsJson = JSON.stringify({ ingredients });

  const pythonProcess = spawn("python", [scriptPath, argsJson], {
    cwd: path.join(__dirname, "../../model/rag_recipe"),
  });

  let output = "";
  let errorOutput = "";

  pythonProcess.stdout.setEncoding("utf8");
  pythonProcess.stdout.on("data", (data) => {
    const text = data.toString();
    console.log("[Python stdout]", text);
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    const text = data.toString();
    console.error("[Python stderr]", text);
    errorOutput += text;
  });

  pythonProcess.on("close", async (code) => {
    console.log("Python 종료 코드:", code);

    if (code !== 0) {
      return res.status(500).json({
        error: "Python 실행 실패",
        code,
        stderr: errorOutput,
      });
    }

    try {
      const result = JSON.parse(output);
      console.log(result);

      //const { final_recipe } = result;

      // const {
      //   title,
      //   description,
      //   priority_used_ingredients,
      //   other_ingredients,
      //   servings,
      //   steps,
      //   tips,
      // } = final_recipe;

      // await pool.query(
      //   `INSERT INTO recipe
      // (recipe_title, recipe_description, priority_used_ingredients, other_ingredients, servings, recipe_steps, recipe_tips)
      // VALUES (?, ?, ?, ?, ?, ?, ?)`,
      //   [
      //     title,
      //     description,
      //     JSON.stringify(priority_used_ingredients),
      //     JSON.stringify(other_ingredients),
      //     servings,
      //     JSON.stringify(steps),
      //     JSON.stringify(tips),
      //   ]
      // );

      res.json({ message: "레시피 생성 완료", recipe: result });
    } catch (err) {
      res.status(500).json({ error: "JSON Parse Error", detail: err.message });
    }
  });
};

exports.saveRecipe = async (req, res) => {
  console.log("레시피 저장 수신 성공");

  const {
    recipe_title,
    recipe_description,
    priority_used_ingredients,
    other_ingredients,
    recipe_steps,
    recipe_tips,
    img_url,
    servings,
    category,
  } = req.body;

  console.log(priority_used_ingredients, other_ingredients);

  try {
    await pool.query(
      `INSERT INTO recipe
      (recipe_title, recipe_description, priority_used_ingredients, other_ingredients, servings, recipe_steps, recipe_tips)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        recipe_title,
        recipe_description,
        JSON.stringify(priority_used_ingredients),
        JSON.stringify(other_ingredients),
        servings,
        JSON.stringify(recipe_steps),
        JSON.stringify(recipe_tips),
      ]
    );

    console.log("DB 저장 성공");

    const recipe_id = await pool.query(
      `SELECT recipe_id FROM recipe WHERE recipe_title = ?`,
      [recipe_title]
    );

    console.log(recipe_id);

    res.json({
      message: "레시피 저장 성공",
      recipe_id: recipe_id,
    });
  } catch (err) {
    res.status(500).json({ error: "JSON Parse Error", detail: err.message });
  }
};

exports.getRecipeList = async (req, res) => {
  console.log("목록 조회 성공");

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

exports.getRecipeListByid = async (req, res) => {
  const { id } = req.params;
  console.log("레시피id확인: " + id);

  try {
    const [row] = await pool.query(
      `
      SELECT recipe_id, recipe_title, recipe_description, priority_used_ingredients,
             other_ingredients, servings, recipe_steps, recipe_tips, created_at
      FROM recipe
      WHERE recipe_id = ?
    `,
      [id]
    );

    res.json({
      message: "레시피 목록 조회 성공",
      recipes: row,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "레시피 조회 실패" });
  }
};

exports.deleteRecipe = async (req, res) => {
  const { id } = req.params;
  console.log("레시피id확인: " + id);

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
