/* eslint-disable no-undef */
// ! Entry point of the Express application
// * Set up ===================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const app = express();

// * Configuration  ===========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger('tiny')); // or 

// * Routes ===================================
const overview_router = require('./src/overview.routes.js');
const cart_router = require('./src/cart.routes.js');
app.use('/products', overview_router);

app.use('/cart', cart_router);


// * Listen ===================================
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});