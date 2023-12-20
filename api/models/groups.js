const DataTypes = require('sequelize');
const db = require('../bin/crud_db')

const Groups = db.define('groups', {
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
  number_course: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  amount_stud: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'groups',
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

module.exports = Groups