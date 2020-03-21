const {Sequelize} = require('sequelize');

module.exports = exports = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        dialect: process.env.DB_CONNECTION,
        dialectOptions: {
            useUTC: false, // for reading from database
            timezone: 'Asia/Taipei' // for writing to database
        },
        host: process.env.DB_HOST,
        logging: false
    }
);
