const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    addToCart,
    removeFromCart,
    toggleFavorite,
    getProfile
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, getProfile);
router.route('/cart').post(protect, addToCart);
router.route('/cart/:productId').delete(protect, removeFromCart);
router.route('/favorites/:productId').post(protect, toggleFavorite);

router.route('/')
    .get(protect, admin, getAllUsers);

router.route('/:id')
    .get(protect, getUserById)
    .put(protect, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;
