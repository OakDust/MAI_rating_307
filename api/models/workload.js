const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('workload', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kafedra: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    id_discipline: {
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
    semester: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    id_group: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stream: {
      type: DataTypes.TEXT,
      allowNull: true
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
    sequelize,
    tableName: 'workload',
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
};
