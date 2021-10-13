"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class user_game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relasi
      user_game.hasOne(models.user_game_biodata, {
        foreignKey: "id",
        as: "id_user_biodata",
      });
      user_game.hasMany(models.user_game_history, {
        foreignKey: "id",
        as: "id_user_history",
      });
      user_game.hasMany(models.master_room, {
        foreignKey: "id",
        as: "id_player_1",
      });
    }

    // Method untuk melakukan enkripsi
    static encrypt = (password) => bcrypt.hashSync(password, 10);
    // Lalu, kita buat method register
    static register = ({ username, password, email, isAdmin }) => {
      const encryptedPassword = this.encrypt(password); /*
        #encrypt dari static method
        encryptedPassword akan sama dengan string
        hasil enkripsi password dari method #encrypt
        */
      return this.create({
        username,
        password: encryptedPassword,
        email,
        isAdmin,
      });
    };
    /* Method .compareSync digunakan untuk mencocokkan plaintext dengan hash. */
    checkPassword = (password) => bcrypt.compareSync(password, this.password);
    /* Method Authenticate, untuk login */
    static authenticate = async ({ email, password }) => {
      try {
        const user = await this.findOne({ where: { email } });
        if (!user) return Promise.reject("User not found!");
        const isPasswordValid = user.checkPassword(password);
        if (!isPasswordValid) return Promise.reject("Wrong password");
        return Promise.resolve(user);
      } catch (err) {
        return Promise.reject(err);
      }
    };
  }

  user_game.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      generate_random: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user_game",
    }
  );
  return user_game;
};
