const { DataTypes } = require('sequelize')
const db = require('../bin/db')

const Teacher = db.define('teacher', {
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
  birthday: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  h_telephone: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  w_telephone: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  m_telephone: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  passport_data: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  scientific_degree: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_appointment: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  rank: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rate: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  INN: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  hourly_rate: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'teacher',
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

module.exports = Teacher;