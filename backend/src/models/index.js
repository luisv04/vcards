const { Sequelize } = require('sequelize');
const User = require('./User');
const Card = require('./Card');

// Configuración de la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Inicializar modelos
const UserModel = User(sequelize);
const CardModel = Card(sequelize);

// Definir asociaciones
UserModel.hasOne(CardModel, {
  foreignKey: 'userId',
  as: 'card',
  onDelete: 'CASCADE'
});

CardModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  sequelize,
  User: UserModel,
  Card: CardModel
}; 