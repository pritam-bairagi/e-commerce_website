import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Marquee from './Marquee';
import HeaderTop from './HeaderTop';
import Footer from './Footer';
import { ShoppingBag, Truck, CreditCard, RotateCcw, Headset, Shield, BriefcaseBusiness, HeartHandshake, Leaf } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('search') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/products?search=${searchQuery}`);
                if (response.data.success) {
                    setProducts(response.data.products);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchQuery]);


    return (
        <div className="min-h-screen bg-white no-copy">
            <HeaderTop />
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-gradient-to-r from-[#E3E6F3] to-[#f8f9fc] overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 text-center lg:text-left z-10"
                    >
                        <h4 className="text-[#088178] font-black uppercase tracking-[0.2em] mb-4">Summer Collection 2026</h4>
                        <h2 className="text-4xl md:text-6xl font-black text-[#222] leading-tight mb-6">
                            Dress Like A <br />
                            <span className="text-[#088178]">Professional</span> Story
                        </h2>
                        <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto lg:mx-0">
                            Discover the latest trends in high-quality fashion and accessories.
                            Premium materials, timeless designs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/shop" className="bg-[#088178] text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-teal-900/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                                <ShoppingBag size={20} /> Shop Collection
                            </Link>
                            <button className="bg-white text-gray-800 font-black py-4 px-10 rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all">
                                Learn More
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 relative"
                    >
                        <div className="absolute -inset-4 bg-[#088178]/5 rounded-full blur-3xl animate-pulse"></div>
                        <img
                            src="https://cdn.dribbble.com/userupload/21201606/file/original-a4f479bae1710c6bbff85c2744af206a.gif"
                            alt="Hero"
                            className="relative w-full max-w-md mx-auto drop-shadow-2xl rounded-[3rem] border-8 border-white"
                        />
                    </motion.div>
                </div>

                {/* Background Shapes */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-[#088178]/5 rounded-full blur-3xl"></div>
            </section>

            {/* Features Bar */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-50 p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: Leaf, title: "Genuine Products", desc: "Eco Friendly" },
                        { icon: HeartHandshake, title: "Authentic Deal", desc: "Producer to Consumer" },
                        { icon: BriefcaseBusiness, title: "Maintenance & Management", desc: "Manufacture-Inventory-E commerce" },
                        { icon: Shield, title: "Trust & Reliability", desc: "Verify-Premium-Back Up" },

                        { icon: Truck, title: "Free Shipping", desc: "Above ৳5000 orders" },
                        { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
                        { icon: CreditCard, title: "Secure Payment", desc: "100% encrypted" },
                        { icon: Headset, title: "24/7 Support", desc: "Dedicated team" }
                    ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-50 text-[#088178] rounded-2xl flex items-center justify-center shrink-0">
                                <feat.icon size={24} />
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-800">{feat.title}</h5>
                                <p className="text-xs text-gray-400">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Products */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-[#222] mb-4">Latest Products</h2>
                    <div className="w-20 h-1.5 bg-[#088178] mx-auto rounded-full"></div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#088178]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2 justify-items-center">
                        {products.length > 0 ? (
                            products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center grayscale opacity-50">
                                <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500 font-bold">No products found. Start adding some!</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Banner */}
            <section className="bg-[#041e42] py-24 px-6 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center text-white relative z-10">
                    <h4 className="text-teal-400 font-bold tracking-[0.3em] mb-4 uppercase">Special Offer</h4>
                    <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Flash Sale: Up to <span className="text-red-500">70% Off</span> <br className="hidden md:block" /> on Daily Wear Collection</h2>
                    <Link to="/shop" className="inline-block bg-[#088178] text-white font-black py-4 px-12 rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-teal-900/50">Explore More</Link>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 border-2 border-white rounded-full"></div>
                </div>
            </section>


{/* Our valuable partner or client or seller */}
<Marquee></Marquee>
            {/* Footer */}
<Footer></Footer>

        </div>
    );
};

export default Home;
