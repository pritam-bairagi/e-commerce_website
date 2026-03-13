const User = require('../models/User');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Only allow updating own account or being an admin
        if (!user._id || (user._id.toString() !== req.user.id && req.user.role !== 'admin')) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this user' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.location = req.body.location || user.location;
        user.bio = req.body.bio || user.bio;
        user.shopName = req.body.shopName || user.shopName;
        user.address = req.body.address || user.address;
        user.paymentMethod = req.body.paymentMethod || user.paymentMethod;

        if (req.user.role === 'admin' && req.body.role) {
            user.role = req.body.role;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber,
                role: updatedUser.role,
                location: updatedUser.location,
                shopName: updatedUser.shopName,
                address: updatedUser.address
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // According to requirements, users cannot delete their account.
        // Even admin should be careful, but we will keep it for admin for now or disable it.
        // The prompt says "user... cannot delete there account or activity or payment/buy list history"

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'User removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add to cart
// @route   POST /api/users/cart
// @access  Private
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = await User.findById(req.user.id);

        const cartItemIdx = user.cart.findIndex(item => item.product && item.product.toString() === productId);

        if (cartItemIdx > -1) {
            user.cart[cartItemIdx].quantity += quantity || 1;
        } else {
            user.cart.push({ product: productId, quantity: quantity || 1 });
        }

        await user.save();
        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Remove from cart
// @route   DELETE /api/users/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cart = user.cart.filter(item => item.product && item.product.toString() !== req.params.productId);
        await user.save();
        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Toggle favorite
// @route   POST /api/users/favorites/:productId
// @access  Private
exports.toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const idx = user.favorites.indexOf(req.params.productId);

        if (idx > -1) {
            user.favorites.splice(idx, 1);
        } else {
            user.favorites.push(req.params.productId);
        }

        await user.save();
        res.status(200).json({ success: true, favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user profile (current user)
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.product').populate('favorites');
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

