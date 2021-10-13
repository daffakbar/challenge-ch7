const {
  user_game,
  user_game_biodata,
  user_game_history,
  master_room,
  user_in_room,
} = require("./../models");
const imgGame = [
  "/images/assets/img/batu.png",
  "/images/assets/img/kertas.png",
  "/images/assets/img/gunting.png",
];
module.exports = {
  viewRoomCreate: async (req, res, next) => {
    let uniqueCode;
    try {
      res.render("room-create", { uniqueCode });
    } catch (error) {
      res.json({ error: error });
    }
  },
  viewMenu: async (req, res, next) => {
    try {
      res.render("menu");
    } catch (error) {
      res.json({ error: error });
    }
  },
  viewJoinGame: async (req, res, next) => {
    await master_room
      .findAll()
      .then((result) => {
        let allRoom = result;

        res.render("menu-join", { allRoom });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  },
  viewRoomVal: async (req, res, next) => {
    await master_room
      .findOne({ where: { id: req.params.id } })
      .then((result) => {
        console.log(result);
        res.render("room-code", { id: result.id });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  viewRoomFight: async (req, res, next) => {
    await master_room
      .findOne({ where: { id: req.params.id } })
      .then(async (result) => {
        console.log(result);
        let player1 = await user_game.findOne({
          where: { id: result.id_player_1 },
        });
        let player2 = await user_game.findOne({
          where: { id: result.id_player_2 },
        });
        res.render("game", { id: result.id, imgGame, player1 });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  createRoom: async (req, res) => {
    let random_room = Math.floor(Math.random() * 100);
    let uniqueCode =
      random_room +
      req.body.nama_room[0] +
      req.body.nama_room[1] +
      req.body.nama_room[2];
    console.log(random_room);
    console.log(req.body.nama_room[0]);
    const room = await master_room
      .create({
        nama_room: req.body.nama_room,
        kode_unik: uniqueCode,
        id_player_1: req.user.dataValues.id,
      })
      .then((result) => {
        // return res.status(201).json({
        //   code: 201,
        //   kode_room: uniqueCode,
        //   message: "berhasil menambahkan data",
        // });
        // console.log(res);
        let idRoom = result.id;
        res.render("room-create", { uniqueCode, idRoom });
      })
      .catch((error) => {
        return res.status(400).json({ code: 400, message: "gagal" });
      });
  },
  // cek validation kode_unik n render to roomplay
  roomValidation: async (req, res, next) => {
    await master_room
      .findOne({ where: { id: req.body.id } })
      .then(async (result) => {
        master_room.update(
          {
            id_player_2: req.user.dataValues.id,
          },
          { where: { id: req.body.id } }
        );
        let idFight = req.body.id;
        console.log(req.body.kode_unik);
        if (result.kode_unik === req.body.kode_unik) {
          // res.render("game", { imgGame, player1, player2 });
          res.redirect(`/room/fight/${idFight}`);
        } else {
          console.log("salah");
        }
      })
      .catch((err) => {
        console.log("salah");
      });
  },
  addHistory: async (req, res) => {
    // console.log(req);
    await user_game_history
      .create({
        point: req.body.point,
        total_play: req.body.total_play,
        id_user_game: req.body.id_user_game,
      })
      .then((result) => {
        res.status(200);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  pickPlayer: async (req, res) => {
    // console.log(req);
    await user_in_room
      .create({
        room_id: req.body.room_id,
        pilihan: req.body.pilihan,
      })
      .then((result) => {
        res.status(200);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
