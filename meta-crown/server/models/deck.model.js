import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Deck = sequelize.define('Deck', {
    deck_id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    user_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    deck_name: { 
      type: DataTypes.STRING(100), 
      allowNull: false 
    },
    cards: { 
      type: DataTypes.JSON, 
      allowNull: false 
    },
    avg_elixir: { 
      type: DataTypes.DECIMAL(3, 1), 
      allowNull: true 
    },
    avg_attack: { 
      type: DataTypes.INTEGER, 
      allowNull: true 
    },
    avg_defense: { 
      type: DataTypes.INTEGER, 
      allowNull: true 
    },
    avg_f2p: { 
      type: DataTypes.INTEGER, 
      allowNull: true 
    },
    created_at: { 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: DataTypes.NOW 
    },
    updated_at: { 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: DataTypes.NOW 
    },
  }, {
    tableName: 'decks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Deck;
};