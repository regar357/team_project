const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
// /recipe/generate
router.post("/generate", recipeController.generateRecipe);
// /recipe/save
router.post("/save", recipeController.saveRecipe);
// /recipe/list
router.get("/list", recipeController.getRecipeList);
// /recipe/list/:id
router.get("/list/:id", recipeController.getRecipeListByid);
// /recipe/delete/:id
router.delete("/delete/:id", recipeController.deleteRecipe);

module.exports = router;
