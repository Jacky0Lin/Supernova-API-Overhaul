const {Pool} = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '54.159.30.165',
  database: 'sdc',
  port: '5432',
  password: '0125',
});

module.exports = pool;