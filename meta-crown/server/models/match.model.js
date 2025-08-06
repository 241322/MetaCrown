export default (sequelize, DataTypes) => {
  return sequelize.define("match", {
    result: { type: DataTypes.ENUM("Win", "Loss", "Draw") },
    opponent_name: { type: DataTypes.STRING },
  });
};