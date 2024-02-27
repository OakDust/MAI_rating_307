const {Sequelize} = require('sequelize')

const custom_db = new Sequelize(
    process.env.STUDENTS_BY_GROUPS_DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        define: {
            timestamps: false
        },
        logging: false
    },

)

module.exports = custom_db