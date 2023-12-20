const {DataTypes} = require('sequelize')
const db = require('../bin/crud_db')


const Load2022 = db.define('load_22', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    discipline_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    discipline_name: {
        type: DataTypes.STRING(92),
        allowNull: true,
        unique: true,
    },
    teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    teacher_name: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    teacher_surname: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    teacher_patronymic: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    lectures: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    practical: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    laboratory: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    group_name: {
        type: DataTypes.STRING(12),
        allowNull: true,
    },
}, {
    tableName: 'load_22',
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
    ]
})


module.exports = Load2022