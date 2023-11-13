const { DataTypes } = require('sequelize')
const db = require('../bin/db')

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
    score: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
  }
)

module.exports = Professor