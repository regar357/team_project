const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
// /recipe/generate
router.post("/generate", recipeController.generateRecipe);
// /recipe/list
router.get("/list", recipeController.getRecipeList);
// DELETE /recipe/delete/:id
router.delete("/delete/:id", recipeController.deleteRecipe);

module.exports = router;
