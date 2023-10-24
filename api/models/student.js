const { DataTypes } = require('sequelize')
const db = require('../bin/db')

const Student = db.define('students', {
    s_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    s_name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        
    },
    s_email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true,
        }
    },
    s_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_head_student: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
  }
)

module.exports = Student