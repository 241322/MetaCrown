export default (sequelize, DataTypes) => {
  return sequelize.define("user", {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    player_tag: { type: DataTypes.STRING, allowNull: false },
  });
};