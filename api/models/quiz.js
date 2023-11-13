const { DataTypes } = require('sequelize')
const db = require('../bin/db')

const Quiz = db.define('quizzes', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
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
            allowNull: true
        },
        seminarian_score: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lecturer_pros: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        seminarian_pros: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        lecturer_cons: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        seminarian_cons: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },{
        tableName: 'quizzes',
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