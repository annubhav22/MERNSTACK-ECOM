const express = require('express');


const {
  fetchAllProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProductsByFilters
} = require('../controller/Product');
const router = express.Router();
router.get('/', fetchAllProducts); // or fetchProductsByFilters if you're using filters
router.get('/:id', fetchProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

exports.router = router;

