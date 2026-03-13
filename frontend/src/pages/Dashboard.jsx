import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/useAuth";
import { LogOut, User, Mail, Shield, Calendar, Settings, Edit2, Save, X, Home, ArrowLeft, Backpack, MoveLeftIcon, MoveLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Products from "../components/Products";

const Dashboard = () => {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        phoneNumber: user?.phoneNumber || "",
        address: user?.address || ""
    });

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/");
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`http://localhost:5000/api/users/${user._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser({ ...user, ...response.data.user });
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
        >
            <button onClick={() => navigate("/")} className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={30} />
            </button>
            <Link to="/" className="absolute top-6 right-6 p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors text-gray-300" title="Back to Home">
                        <Home size={20} />
            </Link>
            <div className="flex flex-col items-center mb-8">
                <div className="size-24 bg-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-indigo-500 ring-opacity-30">
                    <User size={48} className="text-white" />
                </div>
                <div className="flex items-center gap-4">
                    
                    <h2 className='text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text'>
                        {user?.role} profile
                    </h2>

                </div>
            </div>

            <div className='space-y-6'>
                <motion.div
                    className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex justify-between items-center mb-3">
                        <h3 className='text-xl font-semibold text-indigo-400 flex items-center'>
                            <User className="mr-2" size={20} /> Personal Information
                        </h3>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                        </button>
                    </div>

                    {isEditing ? (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <button
                                onClick={handleUpdate}
                                className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold flex items-center justify-center gap-2"
                            >
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className='text-gray-300'><span className='font-bold text-gray-400'>Name:</span> {user?.name}</p>
                            <p className='text-gray-300'><span className='font-bold text-gray-400'>Email:</span> {user?.email}</p>
                            <p className='text-gray-300'><span className='font-bold text-gray-400'>Phone:</span> {user?.phoneNumber || 'N/A'}</p>
                            <p className='text-gray-300'><span className='font-bold text-gray-400'>Address:</span> {user?.address || 'N/A'}</p>
                        </>
                    )}
                </motion.div>

                <motion.div
                    className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className='text-xl font-semibold text-indigo-400 mb-3 flex items-center'>
                        <Shield className="mr-2" size={20} /> Account details
                    </h3>
                    <p className='text-gray-300'>
                        <span className='font-bold text-gray-400'>Status: </span>
                        {user?.isVerified ? (
                            <span className="text-green-400">Verified</span>
                        ) : (
                            <span className="text-red-400">Not Verified</span>
                        )}
                    </p>
                    <p className='text-gray-300'>
                        <span className='font-bold text-gray-400'>Role: </span>
                        <span className="capitalize">{user?.role}</span>
                    </p>
                    <p className='text-gray-300 flex items-center'>
                        <Calendar className="mr-2 text-gray-400" size={16} />
                        <span className='font-bold text-gray-400 mr-2'>Joined: </span>
                        {formatDate(user?.createdAt)}
                    </p>
                </motion.div>

                {/* Dynamic Product Section */}
                <motion.div
                    className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                >
                    <Products />
                </motion.div>

                {user?.role === 'admin' && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link to="/admin" className="block w-full">
                            <button className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2">
                                <Settings size={20} /> Admin Control Panel
                            </button>
                        </Link>
                    </motion.div>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className='mt-8'
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                            className='w-full py-3 px-4 bg-gradient-to-r from-red-500 to-rose-600 text-white 
                        font-bold rounded-lg shadow-lg hover:from-red-500 hover:to-rose-700
                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                >
                    <div className="flex items-center justify-center">
                        <LogOut className="mr-2" size={20} /> Logout
                    </div>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};
export default Dashboard;
