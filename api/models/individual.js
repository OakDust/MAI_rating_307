const { DataTypes } = require('sequelize')
const db = require(`../bin/${process.env.DB_NAME}`)

const Individual = db.define('individual', {
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    discipline: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    type: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    lecturer: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    seminarian: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'individual',
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

module.exports = Individual;