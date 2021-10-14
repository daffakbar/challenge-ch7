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
// player-2
router.get("/room-2/:id", restrict, roomController.viewRoomValPlayer2);
router.get("/room/fight-2/:id", restrict, roomController.viewRoomFight2);

// API
router.post("/room", roomController.createRoom);
router.post("/room/cek", roomController.roomValidation);
router.post("/room/addhistory", roomController.addHistory);
router.post("/room/fight", roomController.pickPlayer);
// player-2
router.post("/room/cek-play-2", roomController.roomValidationPlayer2);

module.exports = router;
