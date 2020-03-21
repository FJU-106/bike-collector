# Bike Collector

This application will collect the information of bike availabilities and stations from PTX.

## Usage

```bash
git clone git@github.com:FJU-106/bike-collector.git
cd bike-collector
npm install # or you may use `yarn` instead
cp .env.example .env
vim .env # edit the .env file, you may use your favorite editor
node index
```

## Running as a Service

```bash
npm install --global pm2 # or `yarn global add pm2`
pm2 start index.js --name bike-collector # the `bike-collector` is the name of the service
```

You can use the following commands to control the application:

- Start(Register): `pm2 start bike-collector`
- Stop: `pm2 stop bike-collector`
- Restart: `pm2 restart bike-collector`
- View Status: `pm2 status bike-collector`
- View Logs: `pm2 log bike-collector`
- Stop and Unregister: `pm2 delete bike-collector`

## See Also

- PTX Website: https://ptx.transportdata.tw
