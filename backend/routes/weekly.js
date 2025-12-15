const express = require("express");
const router = express.Router();
const path = require("path");
const weeklyController = require("../controllers/weeklyController");

//GET /weekly
router.get("/", weeklyController.generateWeeklyRecipe);

module.exports = router;
