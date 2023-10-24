const { Sequelize } = require('sequelize')

module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mysql',
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
