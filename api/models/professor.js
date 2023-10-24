const { DataTypes } = require('sequelize')
const db = require('../bin/db')

const Professor = db.define('professors', {
    p_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    p_name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        
    },
    p_email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    p_password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  }
)

module.exports = Professor