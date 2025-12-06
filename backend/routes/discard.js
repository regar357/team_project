const express = require("express");
const router = express.Router();
const discardController = require("../controllers/discardController");

router.get("/", discardController.getDiscard);
