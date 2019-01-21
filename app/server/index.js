const dotenv = require('dotenv');

const express = require('express');
const app = require('express')();
const server = require('http').Server(app);

const bodyParser = require('body-parser');
const morgan = require('morgan');

const getWeb3 = require('./utils/getWeb3');
const sigUtil = require('eth-sig-util');
const ethUtil = require('ethereumjs-util');

// *
// load env var's
// *
if (process.env.ENV !== 'production') {
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
} else {
  console.log('ENV: ' + process.env.ENV);
}

// *
// db
// *

// Connect to mongoDb
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
async function dbConnect() {
  let conn = null;
  const numRetries = 5;
  for (let i = 1; i < numRetries; ++i) {
    try {
      conn = await mongoose.connect(
        process.env.MONGODB_URL_INT ||
          'mongodb://127.0.0.1:27017/' + process.env.DB_NAME,
        { useNewUrlParser: true }
      );
      break;
    } catch (error) {
      console.log('connection error (', i, ') waiting: ', 1000 * i * 2, ' ms');
      await new Promise(resolve => setTimeout(resolve, 1000 * i * 2));
    }
  }

  if (!conn) {
    process.exit(-1);
  } else {
    console.log('Mongoose connected.');
  }

  return;
}
dbConnect();

// *
// Server
// *

// configure express middleware
app.use(express.static('build_client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(
  morgan('dev', {
    skip: function(req, res) {
      // remove the frontend dev server's 'json' calls from the console output
      return req.originalUrl.indexOf('json') > 0;
    }
  })
);

// http routing
// serve the frontend for all non-api requests
app.get('/*', function(req, res) {
  res.sendFile('index.html', { root: './build_client' });
});

// sockets routing
let io = require('./sockets')(server);

// start server
server.listen(8080, () => {
  console.log('server listening on 8080');
});

// listen for events
// const { instance } = getWeb3.loadWeb3();

// *
// helpers
// *

function servesaAuth(req, res, next) {
  // check for header
  if (!req.headers['x-servesa']) {
    return res.status(401).send([]);
  }

  // parse header object
  const authObject = JSON.parse(req.headers['x-servesa']);
  if (!authObject.message || !authObject.signature) {
    return res.status(401).send([]);
  }

  // recover public key
  const userAddress = sigUtil.recoverPersonalSignature({
    data: authObject.message,
    sig: authObject.signature
  });

  // parse message & check timestamp for expiration
  const message = JSON.parse(
    ethUtil.toBuffer(authObject.message).toString('utf8')
  );

  // pass along userAddress and message
  req.userAddress = userAddress;
  req.userMessage = message;

  // call next middleware function
  next();
}
