export default (sequelize, DataTypes) => {
  return sequelize.define("deck", {
    card_list: { type: DataTypes.TEXT },
  });
};