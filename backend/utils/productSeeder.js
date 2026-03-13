const Product = require('../models/Product');

const products = [
    {
        name: "Cartoon Astronaut T-Shirts",
        description: "Pure cotton comfortable summer t-shirt with astronaut print.",
        price: 499,
        originalPrice: 799,
        image: "https://i.ibb.co/qpz8v8p/f1.jpg",
        category: "Clothing",
        stock: 50
    },
    {
        name: "Flower Print Summer Shirt",
        description: "Lightweight breathable shirt perfect for beach days.",
        price: 599,
        originalPrice: 999,
        image: "https://i.ibb.co/vY8mXF0/f2.jpg",
        category: "Clothing",
        stock: 30
    },
    {
        name: "Vintage Denim Jacket",
        description: "Classic blue denim jacket with sturdy buttons.",
        price: 1299,
        originalPrice: 1999,
        image: "https://i.ibb.co/vL0Nn6v/f3.jpg",
        category: "Clothing",
        stock: 20
    },
    {
        name: "Casual Grey Hoodie",
        description: "Soft fleece lined hoodie for chilly evenings.",
        price: 899,
        originalPrice: 1299,
        image: "https://i.ibb.co/xL0mGzY/f4.jpg",
        category: "Clothing",
        stock: 25
    },
    {
        name: "Sports Running Shoes",
        description: "Durable sole and breathable mesh upper for athletes.",
        price: 2499,
        originalPrice: 3499,
        image: "https://i.ibb.co/pL0mGzY/f5.jpg",
        category: "Footwear",
        stock: 15
    },
    {
        name: "Leather Minimalist Wallet",
        description: "Slim genuine leather wallet with RFID protection.",
        price: 399,
        originalPrice: 699,
        image: "https://i.ibb.co/qL0mGzY/f6.jpg",
        category: "Accessories",
        stock: 100
    }
];

const seedProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.insertMany(products);
            console.log('Sample products seeded successfully');
        } else {
            console.log('Products already exist in database');
        }
    } catch (error) {
        console.error('Product seeding error:', error);
    }
};

module.exports = seedProducts;
