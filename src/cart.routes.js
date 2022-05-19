const express = require('express');
const router = express.Router();
const {queries} = require('./overview.models.js');


router.get('/:token', async (req, res) => {
  const {token} = req.params;
  if (token === 'null') {
    res.status(404).end('no token found');
  } else {
    queries.getCart(token)
      .then((rows) => {
        console.log(rows[0].result);
      })
      .catch((err) => {
        throw err;
      })
    // console.log(req.params);
  }
  // res.end();
});

// router.post('/', async (req, res) => {
//   const {user_token} = req.body;
//   console.log(req.body);
//   // product_id;

// });



module.exports = router;