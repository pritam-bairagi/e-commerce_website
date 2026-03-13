import React, { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import Navbar from '../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Mail, Save, ShoppingBag, Clock } from 'lucide-react';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
        shopName: user?.shopName || '',
        bio: user?.bio || '',
        paymentMethod: user?.paymentMethod || ''
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    React.useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('/api/orders/myorders');
                if (response.data.success) {
                    setOrders(response.data.orders);
                }
            } catch (error) {
                console.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/users/${user._id}`, formData);
            if (response.data.success) {
                toast.success('Profile updated successfully');
                setUser({ ...user, ...response.data.user });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 no-copy">
            <Navbar />
            <div className="pt-24 px-6 max-w-5xl mx-auto">

                <div className="flex flex-col md:flex-row gap-10">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 space-y-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === 'profile' ? 'bg-[#088178] text-white shadow-lg shadow-teal-900/10' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                            <User size={20} /> My Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === 'orders' ? 'bg-[#088178] text-white shadow-lg shadow-teal-900/10' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Clock size={20} /> Order History
                        </button>
                        <button
                            onClick={() => setActiveTab('messages')}
                            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${activeTab === 'messages' ? 'bg-[#088178] text-white shadow-lg shadow-teal-900/10' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Mail size={20} /> Messages
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === 'profile' ? (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-extrabold text-gray-800 mb-8 flex items-center gap-2">
                                    <User className="text-[#088178]" /> Personal Information
                                </h2>
                                <form onSubmit={handleUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-2"><Mail size={16} /> Email Address (Cannot change)</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#088178] outline-none"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">Phone Number</label>
                                        <input
                                            type="text"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#088178] outline-none"
                                            placeholder="+880..."
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><MapPin size={16} /> Shipping Address / Location</label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#088178] outline-none"
                                            rows="4"
                                            placeholder="House no, Street, City..."
                                        />
                                    </div>

                                    {user?.role === 'seller' && (
                                        <>
                                            <div className="sm:col-span-2">
                                                <h3 className="text-xl font-bold text-gray-800 mt-6 mb-4 border-b border-gray-100 pb-2">Seller Store Profile</h3>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Shop Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.shopName}
                                                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#088178] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Payout Method (Bank/BKash)</label>
                                                <input
                                                    type="text"
                                                    value={formData.paymentMethod}
                                                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#088178] outline-none"
                                                    placeholder="Account details for cashout"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Store Bio</label>
                                                <textarea
                                                    value={formData.bio}
                                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#088178] outline-none"
                                                    rows="3"
                                                    placeholder="Describe your store..."
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="sm:col-span-2 mt-4">
                                        <button type="submit" className="btn-primary flex items-center gap-2 justify-center w-full sm:w-auto">
                                            <Save size={18} /> Save Changes
                                        </button>
                                    </div>
                                </form>
                                <div className="mt-12 pt-8 border-t border-gray-100">
                                    <p className="text-sm text-gray-400 italic">
                                        Account security: Personal data is protected according to our privacy policy.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-extrabold text-gray-800 mb-8 flex items-center gap-2">
                                    <Clock className="text-[#088178]" /> Order History
                                </h2>
                                {loading ? (
                                    <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#088178]"></div></div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-10 grayscale opacity-50">
                                        <p className="text-gray-500">No orders found yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <div key={order._id} className="p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-400 uppercase">Order ID</p>
                                                        <p className="font-mono text-xs">{order._id}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-teal-50 text-teal-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-400 uppercase">Total Amount</p>
                                                        <p className="font-bold text-lg text-gray-800">৳{order.totalPrice}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'messages' && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                                <h2 className="text-2xl font-extrabold text-gray-800 mb-4 flex justify-center items-center gap-2">
                                    <Mail className="text-[#088178]" /> Direct Messaging
                                </h2>
                                <p className="text-gray-500 mb-8 max-w-lg mx-auto">
                                    Send messages to Sellers, Admins, or other Users. This feature is coming soon!
                                </p>
                                <div className="text-6xl mb-4">💬</div>
                                <button className="btn-primary" disabled>Start a Conversation</button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
