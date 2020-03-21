require('dotenv').config();

const axios = require('axios');
const JsSha = require('jssha');
const {Sequelize, Model} = require('sequelize');

// Database
const sequelize = new Sequelize(
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

class BikeAvailability extends Model {
}

BikeAvailability.init({
    city: {type: Sequelize.STRING, primaryKey: true, key: true, allowNull: false},
    stationUid: {type: Sequelize.STRING, primaryKey: true, key: true, allowNull: false},
    stationId: {type: Sequelize.STRING, key: true, allowNull: false},
    serviceAvailable: {type: Sequelize.BOOLEAN, allowNull: false},
    availableRentBikes: {type: Sequelize.INTEGER, allowNull: false},
    availableReturnBikes: {type: Sequelize.INTEGER, allowNull: false},
    srcUpdateTime: {type: Sequelize.DATE, allowNull: true},
    updateTime: {type: Sequelize.DATE, key: true, allowNull: false},
    createdAt: {type: Sequelize.DATE, primaryKey: true, key: true, allowNull: false}
}, {
    sequelize,
    modelName: 'availability',
    timestamps: true,
    updatedAt: false
});

const getHeaders = () => {
    const utcString = new Date().toUTCString();
    const ShaObj = new JsSha('SHA-1', 'TEXT');
    ShaObj.setHMACKey(process.env.PTX_APP_KEY, 'TEXT');
    ShaObj.update('x-date: ' + utcString);
    return {
        'Authorization': [
            `hmac username="${process.env.PTX_APP_ID}"`,
            'algorithm="hmac-sha1"',
            'headers="x-date"',
            `signature="${(ShaObj.getHMAC('B64'))}"`
        ].join(', '),
        'X-Date': utcString,
    }
};

const cities = [
    'Taichung', // 臺中市
    'Hsinchu', // 新竹市
    'MiaoliCounty', // 苗栗縣
    'ChanghuaCounty', // 彰化縣
    'NewTaipei', // 新北市
    'PingtungCounty', // 屏東縣
    'Taoyuan', // 桃園市
    'Taipei', // 臺北市
    'Kaohsiung', // 高雄市
    'Tainan' // 臺南市
];

const collect = () => {
    cities.forEach(async city => {
        const result = await axios.get(`https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/${city}`, {headers: getHeaders()});
        if (result.status !== 200) return;
        result.data.forEach(record => {
            if (record.SrcUpdateTime === null) console.log(record);
            BikeAvailability.create({
                city: city,
                stationUid: record.StationUID,
                stationId: record.StationID,
                serviceAvailable: record.ServiceAvailable,
                availableRentBikes: record.AvailableRentBikes,
                availableReturnBikes: record.AvailableReturnBikes,
                srcUpdateTime: record.SrcUpdateTime || null,
                updateTime: record.UpdateTime
            }).catch(Sequelize.ValidationError, err => {
                console.error(err);
            });
        });
    });
};

setInterval(collect, require('parse-duration')(process.env.COLLECTING_INTERVAL));
