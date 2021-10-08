var express = require("express");
var router = express.Router();
const usersController = require("../controllers/usersController");

// Render VIEW
router.get("/register", usersController.viewRegister);
router.get("/login", usersController.viewLogin);

// API
router.post("/register", usersController.register);
router.post("/login", usersController.logins);

module.exports = router;
