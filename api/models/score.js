const {DataTypes} = require('sequelize')
const db = require('../bin/kaf307_opros')


const Scores = db.define('scores', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    groups_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    professor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    is_lecturer: {
        type: DataTypes.BOOLEAN,
    },
    is_seminarian: {
        type: DataTypes.BOOLEAN,
    },
    discipline_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

module.exports = Scores