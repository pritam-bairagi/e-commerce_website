const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    sellingPrice: {
        type: Number,
        required: [true, 'Selling price is required']
    },
    purchasePrice: {
        type: Number,
        required: [true, 'Purchase price is required']
    },
    price: { // Compatibility with existing code
        type: Number,
        required: [true, 'Price is required']
    },
    unit: {
        type: String,
        default: 'পিস'
    },
    originalPrice: {
        type: Number
    },
    image: {
        type: String,
        required: [true, 'Product image is required']
    },
    category: {
        type: String,
        default: 'General'
    },
    stock: {
        type: Number,
        default: 0
    },
    liveStatus: {
        type: String,
        enum: ['live', 'issue', 'not-available'],
        default: 'live'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
