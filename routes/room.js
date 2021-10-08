var express = require("express");
var router = express.Router();
const roomController = require("../controllers/roomController");

// Render VIEW
router.get("/room", roomController.viewRoomCreate);
router.get("/room/:id", roomController.viewRoomFight);

// API
router.post("/room", roomController.createRoom);
router.post("/room/cek", roomController.roomValidation);
router.post("/room/addhistory", roomController.addHistory);

module.exports = router;
