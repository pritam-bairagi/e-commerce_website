import React from 'react';
import { useAuth } from '../contexts/useAuth';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const { user } = useAuth();
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // We can either fetch specific favorite products or filter all products.
        // Better to have a getFavorites endpoint which we already added to userController.
        const fetchFavorites = async () => {
            try {
                // Since user.favorites in context might just be IDs, we re-fetch profile to get populated list
                const { data } = await import('axios').then(m => m.default.get('/api/users/profile'));
                if (data.success) {
                    setProducts(data.user.favorites || []);
                }
            } catch (error) {
                console.error('Failed to fetch favorites');
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    return (
        <div className="min-h-screen bg-[#f1f5f9] no-copy">
            <Navbar />
            <div className="pt-24 px-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-8 flex items-center gap-3">
                    <Heart className="text-red-500 fill-red-500" /> My Favorite Products
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl shadow-sm text-center border border-gray-100 mt-10">
                        <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-4xl">❤️</div>
                        <h2 className="text-xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8">Save products you love and they will appear here.</p>
                        <Link to="/" className="bg-[#088178] text-white font-bold py-3 px-8 rounded-xl">Discover Products</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
