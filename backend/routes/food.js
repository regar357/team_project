const express = require("express");
const router = express.Router();
const multer = require("multer");
const foodController = require("../controllers/foodController");

const upload = multer({ dest: "uploads/" }); // 이미지파일 저장 경로 설정
//GET /food
router.get("/", foodController.getFoodList);
//POST /food/upload
router.post("/upload", upload.single("image"), foodController.uploadFood);
//PUT /food/update
router.put("/:food_id", foodController.updateFood);
//DELETE /food/discard/:food_id
router.delete("/discard/:food_id", foodController.discardFood);

module.exports = router;
