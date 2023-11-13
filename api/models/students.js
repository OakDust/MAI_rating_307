// const Sequelize = require('sequelize');
// module.exports = function(sequelize, DataTypes) {
//   return sequelize.define('students', {
//     id: {
//       autoIncrement: true,
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     name: {
//       type: DataTypes.STRING(64),
//       allowNull: false
//     },
//     email: {
//       type: DataTypes.STRING(64),
//       allowNull: false,
//       unique: "email"
//     },
//     password: {
//       type: DataTypes.STRING(255),
//       allowNull: false
//     },
//     role: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     },
//     groups: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     },
//     is_head_student: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: 0
//     }
//   }, {
//     sequelize,
//     tableName: 'students',
//     timestamps: true,
//     indexes: [
//       {
//         name: "PRIMARY",
//         unique: true,
//         using: "BTREE",
//         fields: [
//           { name: "id" },
//         ]
//       },
//       {
//         name: "id",
//         unique: true,
//         using: "BTREE",
//         fields: [
//           { name: "id" },
//         ]
//       },
//       {
//         name: "email",
//         unique: true,
//         using: "BTREE",
//         fields: [
//           { name: "email" },
//         ]
//       },
//     ]
//   });
// };
