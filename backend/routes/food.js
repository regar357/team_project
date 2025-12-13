const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const foodController = require("../controllers/foodController");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage }); // 이미지파일 저장 경로 설정
//GET /food
router.get("/", foodController.getFoodList);
//POST /food/upload
router.post("/upload", upload.single("image"), foodController.uploadFood);
//PUT /food/update/:food_id
router.put("/update/:food_id", foodController.updateFood);
//DELETE /food/discard/:food_id
router.delete("/discard/:food_id", foodController.discardFood);

module.exports = router;
