const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//DB setup
// telling mongoose to connect to an running instance of on mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth_database')
.catch((err) => {
    console.log(err);
})

// App setup
// middlewares
// app.use(morgan('combined')); // logging framework for debugging
app.use(cors()); // allow request to come from anywhere
app.use(bodyParser.json({type: '*/*'})); // parse incoming request into json

router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port, () => {
    console.log('Server listiing on port ' + port);
})
