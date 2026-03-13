const express = require('express');
const router = express.Router();
const {
    getStats,
    addTransaction,
    getTransactions,
    addSale,
    getSales,
    addPurchase,
    getPurchases,
    getInventoryProducts
} = require('../controllers/adminController');
const { protect, adminOrSeller } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOrSeller);

router.get('/products', getInventoryProducts);
router.get('/stats', getStats);
router.post('/transactions', addTransaction);
router.get('/transactions', getTransactions);
router.post('/sales', addSale);
router.get('/sales', getSales);
router.post('/purchases', addPurchase);
router.get('/purchases', getPurchases);

module.exports = router;
