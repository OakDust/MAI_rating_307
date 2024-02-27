const { Sequelize, DataTypes } = require('sequelize')

const db = require('../bin/infodeml_opros')

const StudentsByGroups = db.define('students_by_groups', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.TEXT,
        },
        groups: {
            type: DataTypes.TEXT,
        },
        is_head_student: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
    }
)

module.exports = StudentsByGroups