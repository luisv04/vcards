const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true // null para usuarios OAuth
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profilePicture: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    language: {
      type: DataTypes.ENUM('es', 'en'),
      defaultValue: 'es'
    },
    theme: {
      type: DataTypes.ENUM('light', 'dark'),
      defaultValue: 'light'
    }
  }, {
    timestamps: true,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  });

  // Métodos de instancia
  User.prototype.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  User.prototype.isFromJasuDomain = function() {
    return this.email.endsWith('@jasu.us');
  };

  User.prototype.toSafeJSON = function() {
    const user = this.toJSON();
    delete user.password;
    delete user.googleId;
    return user;
  };

  // Métodos estáticos
  User.findByEmail = function(email) {
    return this.findOne({ where: { email } });
  };

  User.findByGoogleId = function(googleId) {
    return this.findOne({ where: { googleId } });
  };

  return User;
}; 