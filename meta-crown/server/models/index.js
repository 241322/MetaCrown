import Sequelize from "sequelize";
import dbConfig from "../config/db.config.js";
import userModel from "./user.model.js";
import deckModel from "./deck.model.js";
import matchModel from "./match.model.js";


const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = userModel(sequelize, Sequelize.DataTypes);
db.Deck = deckModel(sequelize, Sequelize.DataTypes);
db.Match = matchModel(sequelize, Sequelize.DataTypes);

// Associations
db.User.hasMany(db.Deck);
db.Deck.belongsTo(db.User);

db.User.hasMany(db.Match);
db.Match.belongsTo(db.User);


export default db;