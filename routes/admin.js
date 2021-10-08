var express = require("express");
var router = express.Router();
const adminController = require("../controllers/adminController");
const { body, validationResult } = require("express-validator");
const restrict = require("../middleware/restrictpass");

// Render VIEW
router.get("/user-admin", restrict, adminController.viewAdmin);
router.get("/user-admin/:id", restrict, adminController.viewEditBiodata);
router.get("/user-admin/history/:id", adminController.viewHistory);

// API
router.post(
  "/register-admin",
  body("username").notEmpty().withMessage("username tidak boleh kosong"),
  body("email").isEmail().withMessage("tidak sesuai format email"),
  body("password")
    .notEmpty()
    .withMessage("password tidak boleh kosong")
    .isLength({ min: 8 })
    .withMessage("minimal 8 karakter"),

  adminController.registerAdmin
);
router.post("/user-admin/update", adminController.updateBiodata);
router.delete("/user-admin/delete/:id/:idx", adminController.removeUser);

module.exports = router;
