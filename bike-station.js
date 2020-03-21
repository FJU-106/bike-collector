const ptx = require('./ptx');
const {Sequelize, Model} = require('sequelize');
const sequelize = require('./sequelize');

class BikeStation extends Model {
}

BikeStation.init({
    city: {type: Sequelize.STRING, key: true, allowNull: false},
    stationUid: {type: Sequelize.STRING, primaryKey: true, key: true, allowNull: false},
    stationId: {type: Sequelize.STRING, key: true, allowNull: false},
    authorityId: {type: Sequelize.STRING, key: true, allowNull: false},
    stationNameEn: {type: Sequelize.STRING, allowNull: true},
    stationNameZh: {type: Sequelize.STRING, allowNull: false},
    stationPositionLatitude: {type: Sequelize.DOUBLE, allowNull: false},
    stationPositionLongitude: {type: Sequelize.DOUBLE, allowNull: false},
    stationAddressEn: {type: Sequelize.STRING, allowNull: true},
    stationAddressZh: {type: Sequelize.STRING, allowNull: false},
    stopDescription: {type: Sequelize.STRING, allowNull: true},
    bikesCapacity: {type: Sequelize.INTEGER, allowNull: false},
    srcUpdateTime: {type: Sequelize.DATE, allowNull: true},
    updateTime: {type: Sequelize.DATE, key: true, allowNull: false}
}, {
    sequelize,
    modelName: 'station',
    timestamps: true
});

module.exports = exports = () => {
    ptx.forEachCities('/MOTC/v2/Bike/Station', (city, result) => {
        if (result.status !== 200) return;
        result.data.forEach(record => {
            const values = {
                city: city,
                stationUid: record.StationUID,
                stationId: record.StationID,
                authorityId: record.AuthorityID,
                stationNameEn: record.StationName.En,
                stationNameZh: record.StationName.Zh_tw,
                stationPositionLatitude: record.StationPosition.PositionLat,
                stationPositionLongitude: record.StationPosition.PositionLon,
                stationAddressEn: record.StationAddress.En,
                stationAddressZh: record.StationAddress.Zh_tw,
                stopDescription: record.StopDescription || null,
                bikesCapacity: record.BikesCapacity,
                srcUpdateTime: record.SrcUpdateTime || null,
                updateTime: record.UpdateTime
            };
            BikeStation.findOne({where: {stationUid: values.stationUid}}).then(obj => {
                if (obj) return obj.update(values);
                return BikeStation.create(values).catch(Sequelize.ValidationError, err => console.error(err));
            });
        });
    });
};
