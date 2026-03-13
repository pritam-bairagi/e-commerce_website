const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { items, totalPrice, shippingAddress, paymentMethod, vat, discount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items' });
        }

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items,
            totalPrice,
            shippingAddress,
            paymentMethod,
            vat: vat || 0,
            discount: discount || 0,
            isPaid: paymentMethod !== 'Cash on Delivery',
            paidAt: paymentMethod !== 'Cash on Delivery' ? Date.now() : null
        });

        // Deduct stock for each item
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.quantity;
                await product.save();
            }
        }

        // Clear user cart
        const user = await User.findById(req.user.id);
        user.cart = [];
        await user.save();

        res.status(201).json({ success: true, order });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'seller') {
            const sellerProducts = await Product.find({ user: req.user.id }).select('_id');
            const productIds = sellerProducts.map(p => p._id);
            query = { "items.product": { $in: productIds } };
        }

        const orders = await Order.find(query).populate('user', 'name email').sort('-createdAt');
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = req.body.status || order.status;
        if (req.body.isPaid !== undefined) {
            order.isPaid = req.body.isPaid;
            if (order.isPaid) order.paidAt = Date.now();
        }
        if (req.body.deliveryOption) {
            order.deliveryOption = req.body.deliveryOption;
        }

        await order.save();
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
