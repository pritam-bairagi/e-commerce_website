import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import Navbar from '../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [vat, setVat] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [shippingAddress, setShippingAddress] = useState(user?.address || '');
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.cart) {
            const validCart = user.cart.filter(item => item.product);
            const sum = validCart.reduce((acc, item) => acc + ((item.product.sellingPrice || item.product.price) * item.quantity), 0);
            setTotal(sum);
            const calculatedVat = sum * 0.02; // 2% VAT & TAX
            setVat(calculatedVat);
            setFinalTotal(sum + calculatedVat - discount);
        }
        setLoading(false);
    }, [user?.cart, discount]);

    const applyCoupon = () => {
        if (couponCode === 'DISCOUNT10') {
            const disc = total * 0.10;
            setDiscount(disc);
            toast.success("10% Discount applied!");
        } else {
            setDiscount(0);
            toast.error("Invalid coupon code");
        }
    };

    const updateQuantity = async (productId, delta) => {
        const item = user.cart.find(i => i.product && i.product._id === productId);
        if (!item) return;
        if (item.quantity <= 1 && delta === -1) return; // Prevent going below 1

        try {
            const response = await axios.post('/api/users/cart', { productId, quantity: delta });
            if (response.data.success) {
                // Re-fetch profile to get latest cart with populated products
                const profileRes = await axios.get('/api/users/profile');
                setUser(profileRes.data.user);
            }
        } catch (error) {
            toast.error('Failed to update quantity');
        }
    };

    const removeItem = async (productId) => {
        try {
            const response = await axios.delete(`/api/users/cart/${productId}`);
            if (response.data.success) {
                toast.success('Removed from cart');
                const profileRes = await axios.get('/api/users/profile');
                setUser(profileRes.data.user);
            }
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        if (!shippingAddress) {
            toast.error('Please provide a shipping address');
            return;
        }
        try {
            const validCartItems = user.cart.filter(item => item.product);
            if (validCartItems.length === 0) {
                toast.error('Cart has no valid items');
                return;
            }

            const response = await axios.post('/api/orders', {
                items: validCartItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.sellingPrice || item.product.price
                })),
                totalPrice: finalTotal,
                shippingAddress,
                paymentMethod,
                vat,
                discount
            });
            if (response.data.success) {
                toast.success('Order placed successfully!');
                setUser({ ...user, cart: [] });
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Checkout failed');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#088178]"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 no-copy">
            <Navbar />
            <div className="pt-24 px-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-8 flex items-center gap-3">
                    <ShoppingBag className="text-[#088178]" /> Your Shopping Cart
                </h1>

                {!user?.cart || user.cart.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl shadow-sm text-center border border-gray-100 mt-10">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 text-4xl">🛒</div>
                        <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Items added to your cart will appear here.</p>
                        <Link to="/" className="btn-primary inline-block">Continue Shopping</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-4">
                            {user.cart.filter(item => item.product).map((item) => (
                                <div key={item.product._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group">
                                    <img
                                        src={item.product.image || '/img/placeholder.png'}
                                        alt={item.product.name}
                                        className="w-24 h-24 object-contain rounded-xl bg-gray-50"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=Product'}
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{item.product.name}</h3>
                                        <p className="text-[#088178] font-bold">৳{item.product.sellingPrice || item.product.price}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                                <button onClick={() => updateQuantity(item.product._id, -1)} className="p-1 px-3 hover:text-[#088178]"><Minus size={16} /></button>
                                                <span className="font-bold w-10 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.product._id, 1)} className="p-1 px-3 hover:text-[#088178]"><Plus size={16} /></button>
                                            </div>
                                            <button onClick={() => removeItem(item.product._id)} className="text-red-400 hover:text-red-600 transition-colors">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs text-gray-400 font-semibold mb-1 uppercase">Subtotal</p>
                                        <p className="text-lg font-bold text-gray-800">৳{(item.product.sellingPrice || item.product.price) * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-2 h-full bg-[#088178]"></div>
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
                                <div className="space-y-4 mb-6 border-b border-gray-50 pb-6 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Items Total</span>
                                        <span>৳{total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>VAT & Tax (2%)</span>
                                        <span>৳{vat.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-[#088178] font-bold">
                                            <span>Discount</span>
                                            <span>-৳{discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-500">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                </div>
                                <div className="flex bg-gray-50 rounded-lg p-1 mb-6 border-dashed border border-gray-200">
                                    <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Coupon Code (e.g DISCOUNT10)" className="w-full bg-transparent px-3 text-xs outline-none" />
                                    <button onClick={applyCoupon} className="bg-gray-800 text-white text-xs px-4 py-2 font-bold rounded-md">Apply</button>
                                </div>
                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-gray-800 font-bold">Estimated Total</span>
                                    <span className="text-3xl font-extrabold text-[#088178]">৳{finalTotal.toFixed(2)}</span>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Shipping Address</label>
                                    <textarea
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#088178] outline-none text-sm"
                                        placeholder="Enter your full address..."
                                        rows="3"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Payment Gateway</label>
                                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#088178] outline-none text-sm font-bold">
                                        <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                                        <option value="BKash">BKash</option>
                                        <option value="Nagad">Nagad</option>
                                        <option value="Roket">Roket</option>
                                        <option value="Upay">Upay</option>
                                        <option value="Bank">Bank Transfer</option>
                                        <option value="Card">Debit/Credit Card</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full btn-primary py-4 text-xl shadow-teal-900/10"
                                >
                                    Confirm Order
                                </button>
                                <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-xs font-semibold">
                                    <i className="fa fa-lock"></i> Secure Checkout Guaranteed
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
