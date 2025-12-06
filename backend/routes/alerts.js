const express = require("express");
const router = express.Router();
const alertsController = require("../controllers/alertsController");

// /alerts
router.get("/", alertsController.getAlerts);
// /alerts/create
router.post("/create", alertsController.createAlerts);

module.exports = router;
