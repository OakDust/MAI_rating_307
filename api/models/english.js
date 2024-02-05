const { DataTypes } = require('sequelize')
const db = require(`../bin/${process.env.DB_NAME}`)

const English = db.define('english', {
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    surname: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    patronymic: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    kafedra: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'english',
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
});

module.exports = English;