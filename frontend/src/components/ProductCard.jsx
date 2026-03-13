import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ShoppingCart, Heart, Star, StarHalf } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { user, setUser } = useAuth();

    const addToCart = async (e) => {
        e.preventDefault(); // Prevent navigation if nested in Link
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }
        try {
            const response = await axios.post('/api/users/cart', {
                productId: product._id,
                quantity: 1
            });
            if (response.data.success) {
                toast.success('Added to cart');
                setUser({ ...user, cart: response.data.cart });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding to cart');
        }
    };

    const toggleFavorite = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to like products');
            return;
        }
        try {
            const response = await axios.post(`/api/users/favorites/${product._id}`);
            if (response.data.success) {
                setUser({ ...user, favorites: response.data.favorites });
                toast.success(response.data.favorites.includes(product._id) ? 'Added to favorites' : 'Removed from favorites');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating favorites');
        }
    };

    // Check if favorited (handle both populated and unpopulated cases)
    const isFavorite = user?.favorites?.some(fav =>
        (typeof fav === 'string' ? fav === product._id : fav._id === product._id)
    );

    return (
        // <div className="w-full max-w-[300px] p-4 border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative bg-white group mt-5">
        <div className="bg-white rounded-xl border border-gray-500 shadow-md hover:shadow-xl transition duration-1 overflow-hidden relative group">
            {/* Badges */}
          <span className="absolute top-0 left-0 bg-green-600 text-white text-xs px-3 py-1 rounded-br-lg opacity-90">
            Free Delivery
          </span>
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-bl-lg opacity-90">
            -${product.discount}%
          </span>

            {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[10px] px-3 py-1 rounded-full font-bold">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
            )}

            <div className="flex flex-col h-full">
                {/* Image Container */}
                <Link to={`/product/${product._id}`} className="bg-white md-40 overflow-hidden">
                    <img
                        className="w-full h-80 object-cover group-hover:scale-105 transition duration-300"
                        src={product.image || '/img/placeholder.png'}
                        alt={product.name}
                        onError={(e) => e.target.src = 'https://picsum.photos/300/200?4'}
                    />
                </Link>

                {/* Content */}
                <div className="space-y-1 pt-2 pb-3 pl-3 pr-3">
                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">{product.category}</p>
                    <h5 className="text-black font-extrabold text-[14px] line-clamp-2 min-h-[40px] leading-tight">{product.name}</h5>

                    {/* Rating */}
                    <div className="flex text-yellow-400 gap-0.5 py-1">
                        <p className="text-blue-900 text-[10px]">{user?.name || 'Guest'}</p> {/* Store Name who upload there product*/}
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>

                    <div className="flex items-end justify-between border-t pt-3">
                        <div>
                            {product.originalPrice && (
                                <p className="text-gray-400 text-xs line-through font-medium">৳{product.originalPrice}</p>
                            )}
                            <p className="text-[#088178] font-black text-xl">৳{product.price}</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={toggleFavorite}
                                className={`w-10 h-10 rounded-xl border border-gray-50 flex items-center justify-center transition-all ${isFavorite ? 'bg-red-50 text-red-500 border-red-100 shadow-sm' : 'bg-gray-50 text-gray-400 hover:text-red-400'}`}
                            >
                                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                            </button>
                            <button
                                onClick={addToCart}
                                className="w-10 h-10 bg-[#E3E6F3] text-[#088178] rounded-xl flex items-center justify-center hover:bg-[#088178] hover:text-white transition-all shadow-sm"
                            >
                                <ShoppingCart size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
