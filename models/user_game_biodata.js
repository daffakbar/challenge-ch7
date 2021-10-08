"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_game_biodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relasi
      user_game_biodata.belongsTo(models.user_game, {
        foreignKey: "id_user_game",
        as: "user_biodata",
      });
    }
  }
  user_game_biodata.init(
    {
      nama: DataTypes.STRING,
      tanggal_lahir: DataTypes.DATE,
      alamat: DataTypes.STRING,
      notelp: DataTypes.STRING,
      id_user_game: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "user_game_biodata",
    }
  );
  return user_game_biodata;
};
