require('dotenv').config();
const express = require('express');
const app = express();
const winston = require('winston');
const cors = require('cors');
const flash = require('express-flash');

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false
}));
app.use(express.json());
require('./config/logger');
require('./config/db')();
app.use(flash());


app.use('/', require('./routes/index'));
app.get('/', (req, res) => {
    res.send('Welcome to the API');
}
);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app, server };