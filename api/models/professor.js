const { DataTypes } = require('sequelize')
const db = require('../bin/crud_db')

const Professor = db.define('professors', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.TEXT,
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    activation_link: {
        type: DataTypes.TEXT,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
  }
)

module.exports = Professor