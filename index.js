require('dotenv').config();
const parse = require('parse-duration');

const runInterval = (handler, timeout) => {
    const id = setInterval(handler, timeout);
    handler();
    return id;
};

runInterval(require('./bike-availability'), parse(process.env.COLLECTING_INTERVAL));
runInterval(require('./bike-station'), parse(process.env.STATION_UPDATE_INTERVAL));
