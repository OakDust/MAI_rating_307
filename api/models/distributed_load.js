const {DataTypes} = require('sequelize');
const db = require(`../bin/${process.env.CURRENT_DB_CONFIG}`)


const DistributedLoad = db.define('distributed_load', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_teacher: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_load_group: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lectures: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  practical: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  laboratory: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  s_practical: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  coursework: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  diploma: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  test: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  exam: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  consultation: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  other: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'distributed_load',
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

module.exports = DistributedLoad
