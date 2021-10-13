var express = require("express");
var router = express.Router();
const roomController = require("../controllers/roomController");
const restrict = require("../middleware/restrictpass");

// Render VIEW
router.get("/menu", restrict, roomController.viewMenu);
router.get("/join-game", restrict, roomController.viewJoinGame);
router.get("/room", restrict, roomController.viewRoomCreate);
router.get("/room/:id", restrict, roomController.viewRoomVal);
router.get("/room/fight/:id", restrict, roomController.viewRoomFight);

// API
router.post("/room", roomController.createRoom);
router.post("/room/cek", roomController.roomValidation);
router.post("/room/addhistory", roomController.addHistory);
router.post("/room/fight", roomController.pickPlayer);

module.exports = router;
