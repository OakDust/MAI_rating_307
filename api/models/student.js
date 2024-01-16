const { DataTypes } = require('sequelize')

const db = require('../bin/kaf307_opros')

const Student = db.define('students', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    activation_link: {
        type: DataTypes.TEXT,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
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
    role: {
        type: DataTypes.TEXT
    },
    groups: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_head_student: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
  }
)

module.exports = Student