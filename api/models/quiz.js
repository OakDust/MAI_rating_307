const { DataTypes } = require('sequelize')
//
const db = require('../bin/crud_db')

const Quiz = db.define(`${process.env.CURRENT_YEAR_QUIZZES}`, {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        discipline_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        lecturer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        seminarian_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        lecturer_score: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        seminarian_score: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        lecturer_pros: {
            type: DataTypes.STRING(1024),
            allowNull: true
        },
        seminarian_pros: {
            type: DataTypes.STRING(1024),
            allowNull: true
        },
        lecturer_cons: {
            type: DataTypes.STRING(1024),
            allowNull: true
        },
        seminarian_cons: {
            type: DataTypes.STRING(1024),
            allowNull: true
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        tableName: `${process.env.CURRENT_YEAR_QUIZZES}`,
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            },
            {
                name: "id",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            },
        ]
    }
)

module.exports = Quiz