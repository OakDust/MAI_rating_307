const { Sequelize } = require('sequelize')

const URI = `${process.env.DB_DIALECT}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,

    },
)

// module.exports = new Sequelize(
//     'kaf307_opros',
//     'student',
//     'Rn#3NBfi@8HM',
//     {
//         dialect: 'mysql',
//         dialectOptions: {
//             connectTimeout:100000
//         },
//         host: 'dbadmin.defi.su',
//         port: 3306
//     }
// )
