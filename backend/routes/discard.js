const express = require("express");
const router = express.Router();
const discardController = require("../controllers/discardController");

// /discard
router.get("/", discardController.getDiscard);

module.exports = router;
