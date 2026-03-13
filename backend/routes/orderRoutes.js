const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin, adminOrSeller } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, adminOrSeller, getAllOrders)
    .post(protect, createOrder);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id/status').put(protect, adminOrSeller, updateOrderStatus);

module.exports = router;
