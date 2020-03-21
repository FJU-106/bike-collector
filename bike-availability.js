const ptx = require('./ptx');
const {Sequelize, Model} = require('sequelize');
const sequelize = require('./sequelize');

class BikeAvailability extends Model {
}

BikeAvailability.init({
    city: {type: Sequelize.STRING, key: true, allowNull: false},
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

module.exports = exports = () => {
    ptx.forEachCities('/MOTC/v2/Bike/Availability', (city, result) => {
        if (result.status !== 200) return;
        result.data.forEach(record => {
            BikeAvailability.create({
                city: city,
                stationUid: record.StationUID,
                stationId: record.StationID,
                serviceAvailable: record.ServiceAvailable,
                availableRentBikes: record.AvailableRentBikes,
                availableReturnBikes: record.AvailableReturnBikes,
                srcUpdateTime: record.SrcUpdateTime || null,
                updateTime: record.UpdateTime
            }).catch(Sequelize.ValidationError, err => console.error(err));
        });
    });
};
