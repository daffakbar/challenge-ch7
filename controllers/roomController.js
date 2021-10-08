const {
  user_game,
  user_game_biodata,
  user_game_history,
  master_room,
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
  viewRoomFight: async (req, res, next) => {
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
      })
      .then((result) => {
        // return res.status(201).json({
        //   code: 201,
        //   kode_room: uniqueCode,
        //   message: "berhasil menambahkan data",
        // });
        res.render("room-create", { uniqueCode });
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
        let player1 = await user_game.findOne({
          where: { id: result.id_player_1 },
        });
        let player2 = await user_game.findOne({
          where: { id: result.id_player_2 },
        });
        console.log(player1);
        console.log(player2);
        console.log(req.body.kode_unik);
        if (result.kode_unik === req.body.kode_unik) {
          res.render("game", { imgGame, player1, player2 });
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
};
