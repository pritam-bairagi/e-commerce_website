const express = require('express');
const router = express.Router();
const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, admin, adminOrSeller } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProducts)
    .post(protect, adminOrSeller, createProduct);

router.route('/:id')
    .put(protect, adminOrSeller, updateProduct)
    .delete(protect, adminOrSeller, deleteProduct);

module.exports = router;
