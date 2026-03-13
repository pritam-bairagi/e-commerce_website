import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import ShowOptions from './SearchBox' ;
// import ShopPage from './ShopPage';

import { ShoppingBag, ShoppingCart, House, Search, Menu, X, User, Heart, Settings, LogOut, ShoppingBagIcon, ScanSearch } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isHidden, setIsHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY <= 0) {
                setIsHidden(false);
                return;
            }
            if (currentScrollY > lastScrollY + 5) {
                setIsHidden(true);
            } else if (currentScrollY < lastScrollY - 5) {
                setIsHidden(false);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/?search=${searchQuery}`);
            setIsMobileSearchOpen(false);
        }
    };

    return (
        <section className={`fixed top-0 w-full bg-white/80 backdrop-blur-md z-[1000] transition-transform duration-300 ease-out shadow-md z-5000 border-t border-gray-200 ${isHidden ? '-translate-y-14' : 'translate-y-11'}`} >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 md:px-10 sm:px-6">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <img className="w-10 drop-shadow-[0_0_25px_rgba(16,185,129,0.8)]" src="/logo.png" alt="" style={{ width: '40px' }} />
                    <span className="text-xl font-black text-gray-800 tracking-tighter">PARASH FERI</span>
                </Link>

                {/* Desktop Search */}
                <div className="relative hidden md:block flex-1 max-w-sm mx-12">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full px-5 py-2.5 bg-gray-100 border border-gray-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#088178] text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <ShowOptions className="absolute right-4 top-2.5 text-black" />
                    <Search className="absolute right-10 top-3 text-gray-400" size={18} />
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-600">
                    <Link to="/" className="text-[#088178]">Home</Link>
                    <Link to="/shop" className="hover:text-[#088178] transition">Shop</Link>
                    {/* <Link to="/ShopPage" className="hover:text-[#088178] transition">Shop Page</Link> */}

                    <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-100">
                        <Link to="/favorites" className="hover:text-red-500 transition relative">
                            <Heart size={20} />
                            {user?.favorites?.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center animate-bounce">{user.favorites.length}</span>}
                        </Link>
                        <Link to="/cart" className="hover:text-[#088178] transition relative">
                            <ShoppingCart className='mr-4' size={22} />
                            {user?.cart?.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#088178] text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{user.cart.length}</span>}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard" className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition shadow-sm"><User size={20} /></Link>
                                {user.role === 'admin' && <Link to="/admin" className="p-2 bg-teal-50 text-[#088178] rounded-xl hover:bg-teal-100 transition"><Settings size={20} /></Link>}
                                {user.role === 'seller' && <Link to="/seller" className="p-2 bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-100 transition"><Settings size={20} /></Link>}
                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition"><LogOut size={20} /></button>
                            </div>
                        ) : (
                            <Link to="/login" className="px-6 p-4 m-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 text-center">Get Started</Link>
                        )}
                    </div>
                </div>

                {/* Mobile Icons */}
                <div className="flex items-center md:hidden gap-5">
                    <button onClick={() => setIsMobileSearchOpen(true)} className="text-gray-500"><Search size={22} /></button>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-700"><Menu size={26} /></button>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {isMobileSearchOpen && (
                <div className="md:hidden fixed inset-x-0 top-0 bg-white p-4 shadow-xl z-[1100] animate-in slide-in-from-top duration-300">
                    <div className="relative flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Find something special..."
                            className="flex-1 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#088178]"
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <button onClick={() => setIsMobileSearchOpen(false)} className="bg-gray-100 p-3 rounded-2xl text-gray-500"><X size={20} /></button>
                    </div>
                </div>
            )}

            {/* Mobile Slide Menu */}
            <div className={`fixed inset-y-0 right-0 w-[300px] h-[200vh] bg-white z-[1200] transition-transform duration-200 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className=" bg-white">
                    <div className="bg-white flex items-right justify-end">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-5 text-gray-400 hover:text-red-500"><X size={28} /></button>
                    </div>

                    <ul className="bg-white p-20 px-10 space-y-6">
                        <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex text-2xl font-black text-[#088178]"><House className="w-10 pr-1"/>Home</Link></li>
                        <li><Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="flex text-2xl font-black text-gray-800"><ShoppingCart className="w-10 pr-1"/>Shop</Link></li>
                        <li><Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="flex text-2xl font-black text-gray-800"><Heart className="w-10 pr-1" /> Wishlist
                        {user?.favorites?.length > 0 && <span className=" bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{user.favorites.length}</span>}
                        </Link></li>
                        
                        <li><Link to="/cart" className="flex text-2xl font-black text-gray-800 relative" onClick={() => setIsMobileMenuOpen(false)}>
                        <ShoppingBag className="w-10 pr-1" /> Cart
                        {user?.cart?.length > 0 && <span className=" bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{user.cart.length}</span>}
                        </Link></li>
                        
                        <hr className="border-gray-50" />
                        {user ? (
                            <>
                                <li><Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex text-2xl font-black text-gray-800"><User className="w-10 pr-1" /> My Profile</Link></li>
                                {/* <li><Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-gray-600"><Heart size={20} /> Wishlist</Link></li> */}
                                {user.role === 'admin' && <li><Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-teal-600"><Settings size={20} /> Administration</Link></li>}
                                {user.role === 'seller' && <li><Link to="/seller" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-orange-500"><Settings size={20} /> Seller Panel</Link></li>}
                                <li className="pt-4"><button onClick={handleLogout} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black flex items-center justify-center gap-2"><LogOut size={20} /> Sign Out</button></li>
                            </>
                        ) : (
                            <li><Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 text-center">Get Started</Link></li>
                        )}
                    </ul>

                </div>
            </div>
        </section>
    );
};

export default Navbar;
