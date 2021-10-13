const {
  user_game,
  user_game_biodata,
  user_game_history,
} = require("../models");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const rhs = "rahasia";
const passport = require("../lib/passport");

module.exports = {
  viewRegister: (req, res, next) => {
    res.render("register");
  },
  viewLogin: (req, res, next) => {
    res.render("login");
  },
  register: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = await user_game.findOne({
      where: { username: req.body.username },
    });

    if (data) {
      return res.status(400).json({ message: "username sudah ada" });
    }
    // logika random
    // username + random angka

    // random 3 data
    let suggestRandom = [];
    for (let i = 0; i < 3; i++) {
      let randomAngka = Math.floor(Math.random() * 3);
      suggestRandom.push(req.body.username + randomAngka.toString());
    }
    let isAdmin = req.body.isAdmin;
    console.log("awal" + isAdmin);
    if (isAdmin === undefined) {
      isAdmin = false;
    }
    console.log(isAdmin);

    // hashing password
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      // Store hash in your password DB.

      user_game
        .create({
          username: req.body.username,
          password: hash,
          email: req.body.email,
          isAdmin: isAdmin,
          generate_random: suggestRandom[0],
        })
        .then((result) => {
          user_game_biodata
            .create({
              nama: req.body.nama,
              tanggal_lahir: req.body.tanggal_lahir,
              alamat: req.body.alamat,
              notelp: req.body.notelp,
              id_user_game: result.id,
            })
            .catch((error) => {
              console.log(error);
            });
          message = "berhasil menambahkan data";
          //   return res.redirect("/");
          // return res
          //   .status(201)
          //   .json({ code: 201, message: message, data: result });
          res.redirect("login");
        });
    });
  },
  loginJWT: async (req, res, next) => {
    const data = await user_game.findOne({
      where: { email: req.body.email },
    });
    if (!data) {
      res.json({ success: false, msg: "Email tidak terdaftar" });
    } else {
      const validPass = await bcrypt.compare(req.body.password, data.password);
      if (!validPass) {
        res.status(400).json({ error: "Invalid Password" });
      } else {
        var token = jwt.sign(data.toJSON(), rhs, {
          expiresIn: "24h",
        });
        res.status(200).json({ message: "Valid password", token: token });
      }
    }
  },
  loginLocal: passport.authenticate("local", {
    successRedirect: "/menu",
    failureRedirect: "/login",
    failureFlash: true, // Untuk mengaktifkan express flash
  }),
};
