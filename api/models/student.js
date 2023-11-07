const { DataTypes } = require('sequelize')
const db = require('../bin/db')

const Student = db.define('students', {
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
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    groups: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_head_student: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
  }
)

module.exports = Student