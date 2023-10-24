// const { DataTypes } = require('sequelize')
// const db = require('../bin/db')
//
// const Teacher = db.define('teacher', {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//             allowNull: false,
//             unique: true
//         },
//         name: {
//             type: DataTypes.TEXT,
//
//         },
//         surname: {
//             type: DataTypes.TEXT,
//         },
//         birthday: {
//             type: DataTypes.TEXT
//         },
//         patronymic: {
//             type: DataTypes.TEXT,
//         },
//         address: {
//                 type: DataTypes.TEXT,
//             },
//         h_telephone: {
//                 type: DataTypes.TEXT,
//             },
//         w_telephone: {
//                 type: DataTypes.TEXT,
//             },
//         m_telephone: {
//                 type: DataTypes.TEXT,
//             },
//         passport_data: {
//                 type: DataTypes.TEXT,
//             },
//         scientific_degree: {
//                 type: DataTypes.TEXT,
//             },
//         id_appointment: {
//                 type: DataTypes.NUMBER,
//             },
//         rank: {
//                 type: DataTypes.TEXT,
//             },
//         rate: {
//                 type: DataTypes.TEXT,
//             },
//         INN: {
//                 type: DataTypes.TEXT,
//             },
//         comment: {
//                 type: DataTypes.TEXT,
//             },
//         hourly_rate: {
//                 type: DataTypes.NUMBER,
//             },
//         timestamp: false
//
//         }
// )
//
// module.exports = Teacher