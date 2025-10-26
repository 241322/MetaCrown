import { Sequelize } from 'sequelize';
import dbConfig from '../config/db.config.js';
import userModel from './user.model.js';
import deckModel from './deck.model.js';
import contactMessageModel from './contactMessage.model.js';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = userModel(sequelize);
db.Deck = deckModel(sequelize);
db.ContactMessage = contactMessageModel(sequelize);

// Define associations
db.User.hasMany(db.Deck, { foreignKey: 'user_id', as: 'decks' });
db.Deck.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });

export default db;