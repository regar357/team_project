const express = require("express");
const router = express.Router();
const multer = require("multer");
const foodController = require("../controllers/foodController");

const upload = multer({ dest: "uploads/" }); // 이미지파일 저장 경로 설정

router.post("/upload", upload.single("image"), foodController.uploadFood);

module.exports = router;
