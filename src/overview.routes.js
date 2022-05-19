const express = require('express');
const router = express.Router();
const {queries} = require('./overview.models.js');
// ? middleware
// router.use((req, res, next) => {
//   console.log('overview router working now!');
//   // console.log(req.body);
//   next();
// })

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  // currently, no related products, so it could be null
  if (id === 'null') {
    res.status(404).end('Product ID is not valid!');

    // default product id
  } else {
    queries.getProductInfo(id)
      .then((rows) => {
        let result = JSON.parse(rows[0].result)[0];
        // console.log(typeof result);
        // console.log(result);
        res.send(JSON.stringify(result));
      })
      .catch((err) => {
        throw err;
      })
    // console.log(req.params);
  }
  // res.end();
})

router.get('/:id/styles', async (req,res) => {
  const { id } = req.params;

  if (id === 'null') {
    res.status(404).end('Product ID is not valid');
  } else {
    queries.getProductStyles(id)
      .then((rows) => {
        const results = rows[0].result;
        const data = {product_id: id, results, };
        // console.log(JSON.stringify(obj, null, 2));
        results.forEach((result) => {
          let sale = result.sale_price;
          result.sale_price = sale === "null" ? result.original_price : sale;
          let objs = {};
          result.skus.forEach(sku => {
            const {size, quantity} = sku;
            objs[size] = quantity
          })
          result.skus = objs;
        })
        res.send(data);
      })
  }
  
})

// ! not being used
router.get('/:id/related', async (req, res) => {
  const {id} = req.params;
  if (id === 'null') {
    res.status(404).end('Product ID is not valid');
  } else { 
    queries.getRelatedProducts(id)
      .then((rows) => {
        rows = rows.map(row => row.related_pid);
        console.log(rows);
        res.send(rows);
      })
  }  
})

module.exports = router;