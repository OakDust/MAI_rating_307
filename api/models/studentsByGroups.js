const { Sequelize, DataTypes } = require('sequelize')

const db = new Sequelize(
    process.env.STUDENTS_BY_GROUPS_DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        define: {
            timestamps: false
        },
    },

)

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