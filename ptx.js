const axios = require('axios');
const JsSha = require('jssha');

const callApi = async path => {
    const utcString = new Date().toUTCString();
    const ShaObj = new JsSha('SHA-1', 'TEXT');
    ShaObj.setHMACKey(process.env.PTX_APP_KEY, 'TEXT');
    ShaObj.update('x-date: ' + utcString);
    return await axios.get(`https://ptx.transportdata.tw${path}`, {
        headers: {
            'Authorization': [
                `hmac username="${process.env.PTX_APP_ID}"`,
                'algorithm="hmac-sha1"',
                'headers="x-date"',
                `signature="${(ShaObj.getHMAC('B64'))}"`
            ].join(', '),
            'X-Date': utcString,
        }
    });
};

const forEachCities = (path, callbackfn) => [
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
].forEach(async city => callbackfn(city, await callApi(`${path}/${city}`)));

module.exports = exports = {callApi: callApi, forEachCities: forEachCities};
