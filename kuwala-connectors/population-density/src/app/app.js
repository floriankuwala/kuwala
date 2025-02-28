require('dotenv').config({ path: `config/env/.env.${process.env.NODE_ENV}` });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger');
const { cell, geojson, radius } = require('./routes');

const app = express();

app.use(cors());
app.use(pino());
app.use(bodyParser.json({ limit: '1MB' }));
app.use('/cell', cell);
app.use('/geojson', geojson);
app.use('/radius', radius);

const connectDb = () => {
    const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env;
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    };

    return mongoose.connect(
        `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`,
        options
    );
};

connectDb().then(() => {
    const { API_PORT } = process.env;

    app.listen(API_PORT, () => {
        console.info(`REST API listening on port ${API_PORT}`);
    });
});

module.exports = app;
