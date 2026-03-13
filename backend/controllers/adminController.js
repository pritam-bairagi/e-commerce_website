const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get Inventory Products
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getInventoryProducts = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };
        const products = await Product.find(query).populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };
        const totalProducts = await Product.countDocuments(query);
        const activeUsers = await User.countDocuments({ role: 'user' });

        // Models to fetch scoped data from
        const orders = await Order.find({ status: 'Delivered', ...query });
        const directSales = await Sale.find({ status: 'Delivered', ...query });

        const totalSalesAmount = [...orders, ...directSales].reduce((acc, curr) => acc + (curr.totalPrice || curr.totalAmount), 0);

        // Cash Box stats
        const cashIn = await Transaction.find({ type: 'Cash In', ...query });
        const cashOut = await Transaction.find({ type: 'Cash Out', ...query });
        const totalCashIn = cashIn.reduce((acc, curr) => acc + curr.amount, 0);
        const totalCashOut = cashOut.reduce((acc, curr) => acc + curr.amount, 0);
        const totalCashBox = totalCashIn - totalCashOut;

        // Stock and Cost calculations
        const allProducts = await Product.find(query);
        const totalStockValue = allProducts.reduce((acc, p) => acc + (p.stock * p.sellingPrice), 0);
        const totalCost = allProducts.reduce((acc, p) => acc + (p.stock * p.purchasePrice), 0);

        // Daily Sales aggregation (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailySales = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, status: 'Delivered', ...(req.user.role !== 'admin' && { user: req.user._id }) } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: "$totalPrice" } } },
            { $sort: { _id: 1 } }
        ]);

        const monthlySales = await Order.aggregate([
            { $match: { status: 'Delivered', ...(req.user.role !== 'admin' && { user: req.user._id }) } },
            { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, total: { $sum: "$totalPrice" } } },
            { $sort: { _id: 1 } },
            { $limit: 12 }
        ]);

        const topProducts = await Order.aggregate([
            { $match: { ...(req.user.role !== 'admin' && { user: req.user._id }) } },
            { $unwind: "$items" },
            { $group: { _id: "$items.product", count: { $sum: "$items.quantity" } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productInfo' } },
            { $unwind: "$productInfo" }
        ]);

        // Inventory Aging (finding products created > 30 days ago that still have stock)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const inventoryAging = await Product.find({ createdAt: { $lte: thirtyDaysAgo }, stock: { $gt: 0 }, ...query })
            .sort({ stock: -1 }).limit(10);

        res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                totalSales: totalSalesAmount,
                totalCashBox,
                activeUsers,
                totalStockValue,
                totalCost,
                totalProfit: totalSalesAmount - totalCost > 0 ? totalSalesAmount - totalCost : 0,
                totalLoss: totalCost - totalSalesAmount > 0 ? totalCost - totalSalesAmount : 0,
                dailySales,
                monthlySales,
                topProducts,
                inventoryAging
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add Cash Transaction
// @route   POST /api/admin/transactions
// @access  Private/Admin
exports.addTransaction = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const transaction = await Transaction.create(req.body);
        res.status(201).json({ success: true, transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get All Transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
exports.getTransactions = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };
        const transactions = await Transaction.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add Direct Sale
// @route   POST /api/admin/sales
// @access  Private/Admin
exports.addSale = async (req, res) => {
    try {
        const { product: productId, quantity, totalAmount, paymentMethod } = req.body;

        // Deduct stock
        const product = await Product.findById(productId);
        if (!product || product.stock < quantity) {
            return res.status(400).json({ success: false, message: 'Insufficient stock or product not found' });
        }
        if (req.user.role !== 'admin' && (!product.user || product.user.toString() !== req.user.id)) {
            return res.status(401).json({ success: false, message: 'Not authorized to sell this product' });
        }

        req.body.user = req.user.id;
        const sale = await Sale.create(req.body);

        product.stock -= quantity;
        await product.save();

        res.status(201).json({ success: true, sale });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get All Sales
// @route   GET /api/admin/sales
// @access  Private/Admin
exports.getSales = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };
        const sales = await Sale.find(query).populate('product').sort({ createdAt: -1 });
        res.status(200).json({ success: true, sales });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add Purchase
// @route   POST /api/admin/purchases
// @access  Private/Admin
exports.addPurchase = async (req, res) => {
    try {
        const { product: productId, quantity, totalAmount } = req.body;

        // Add stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        if (req.user.role !== 'admin' && (!product.user || product.user.toString() !== req.user.id)) {
            return res.status(401).json({ success: false, message: 'Not authorized to purchase this product' });
        }

        req.body.user = req.user.id;
        const purchase = await Purchase.create(req.body);

        product.stock += parseInt(quantity);
        await product.save();

        res.status(201).json({ success: true, purchase });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get All Purchases
// @route   GET /api/admin/purchases
// @access  Private/Admin
exports.getPurchases = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };
        const purchases = await Purchase.find(query).populate('product').sort({ createdAt: -1 });
        res.status(200).json({ success: true, purchases });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
