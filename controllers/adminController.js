const {
  user_game,
  user_game_biodata,
  user_game_history,
} = require("../models");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

module.exports = {
  viewAdmin: async (req, res) => {
    const getUserGame = await user_game_biodata.findAll({
      include: [{ model: user_game, as: "user_biodata" }],
    });
    let user = req.user.dataValues.username;
    console.log(req.user.dataValues.id);
    res.render("admin/index", { getUserGame, user });
  },
  viewEditBiodata: async (req, res) => {
    const id = req.params.id;
    const getGameBiodata = await user_game_biodata.findOne({
      include: [{ model: user_game, as: "user_biodata" }],
      where: {
        id: id,
      },
    });
    res.render("admin/editBiodata", { getGameBiodata });
  },
  viewHistory: async (req, res) => {
    const id = req.params.id;
    const getGamerHistory = await user_game_history.findAll({
      include: [{ model: user_game, as: "user_history" }],
      where: {
        id_user_game: id,
      },
    });
    res.render("admin/userhistory", { getGamerHistory });
  },
  registerAdmin: async (req, res, next) => {
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
              alamat: req.body.alamat,
              notelp: req.body.notelp,
              nama: req.body.nama,
              tanggal_lahir: req.body.tanggal_lahir,
              id_user_game: result.id,
            })
            .catch((error) => {
              console.log(error);
            });
          message = "berhasil menambahkan data";
          return res.redirect("user-admin");
        });
    });
  },
  updateBiodata: async (req, res) => {
    // const id = req.params.id;
    await user_game_biodata
      .update(
        {
          alamat: req.body.alamat,
          notelp: req.body.notelp,
          nama: req.body.nama,
          tanggal_lahir: req.body.tanggal_lahir,
          id_user_game: req.body.id_user_game,
        },
        {
          where: {
            id: req.body.idx,
          },
        }
      )
      .then((result) => {
        user_game.update(
          {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
          },
          {
            where: {
              id: req.body.id,
            },
          }
        );
      })
      .catch((err) => {
        res.json(err);
      });
    res.redirect("/user-admin");
  },
  removeUser: async (req, res) => {
    const deleteUser = await user_game.destroy({
      where: {
        id: req.params.id,
      },
    });
    const deleteGame = await user_game_biodata.destroy({
      include: [{ model: user_game, as: "user_biodata" }],
      where: {
        id: req.params.idx,
      },
    });
    if (!deleteUser) {
      res.status(400).json({ msg: "Data user tidak ada" });
    }
    // res.status(200).json({
    //   status: 200,
    //   msg: "berhasil delete user game",
    //   // data: deleteUser,
    // });
    res.render("admin/index", { getUserGame });
  },
};
