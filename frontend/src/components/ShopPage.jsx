import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import ShowOptions from './SearchBox';
import Footer from '../pages/Footer';
import {
  SlidersHorizontal, ShoppingBag, ShoppingCart, House, Search, Menu, X,
  User, Heart, Settings, LogOut, Star, ArrowLeft, Package, Shield,
  Truck, RotateCcw, ChevronLeft, ChevronRight, Camera, Flame, Tag,
  Zap, BookOpen, Smartphone, Laptop, Grid, List, Filter, CheckCircle,
  Clock, AlertCircle, Eye, Plus, Minus
} from 'lucide-react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "electronics", label: "Electronics", icon: <Smartphone size={16} />,
    sub: [{ name: "Mobile Phones", count: 120 }, { name: "Laptops", count: 80 },
          { name: "Desktops", count: 120 }, { name: "Circuit Boards", count: 80 },
          { name: "Cable / Connectors", count: 120 }, { name: "Accessories", count: 80 },
          { name: "Headphones", count: 150 }, { name: "Cameras", count: 60 }]
  },
  {
    id: "fashion", label: "Fashion", icon: <Tag size={16} />,
    sub: [{ name: "Dress", count: 300 }, { name: "Shoes", count: 60 },
          { name: "Jewelry", count: 50 }, { name: "Perfume", count: 87 },
          { name: "Cosmetics", count: 50 }, { name: "Glasses", count: 87 },
          { name: "Bags", count: 50 }, { name: "Watch", count: 87 }]
  },
  {
    id: "books", label: "Books", icon: <BookOpen size={16} />,
    sub: [{ name: "Fiction", count: 300 }, { name: "Non-Fiction", count: 60 },
          { name: "Religion", count: 300 }, { name: "PDF", count: 60 },
          { name: "Academic", count: 50 }, { name: "Children", count: 87 }]
  },
  {
    id: "pujarUporikoron",
    label: "পূজার উপকরণ",
    icon: <Star size={16} />,
    sub: [
      { name: "চন্দন গুঁড়া / চন্দন পেস্ট", count: 120 },
      { name: "কস্তুরী / সুগন্ধি দ্রব্য", count: 80 },
      { name: "ধূপকাঠি / ধুনো", count: 200 },
      { name: "প্রদীপ / মাটির দীপ / পিতলের প্রদীপ", count: 150 },
      { name: "তুলোর বাতি", count: 120 },
      { name: "পূজার থালা / পিতলের পাত্র", count: 100 },
      { name: "ঘণ্টা / শঙ্খ", count: 60 },
      { name: "ফল (কলা, আপেল, নারকেল)", count: 200 },
      { name: "দুধ / দই / ঘি/ মধু", count: 150 },
      { name: "মিষ্টি / পায়েস / ক্ষীর", count: 120 },
      { name: "মধুপর্ক (মধু, দই, ঘি, দুধ, চিনি)", count: 70 },
      { name: "ফুল (জবা, গাঁদা, পদ্ম)", count: 200 },
      { name: "পাতা (বেল, তুলসী, জগডুমুর)", count: 150 },
      { name: "শাড়ি / ধুতি / উত্তরি / পাঞ্জাবি ", count: 90 },
      { name: "গুড় / চিনি", count: 80 },
      { name: "আচমনীয় জল / গঙ্গা জল", count: 50 },
      { name: "অর্ঘ্য দ্রব্য (ফুল, চাল, দই, দূর্বা)", count: 100 },
      { name: "সিঁদুর / হলুদ / মেহেদী / কুমকুম", count: 150 },
      { name: "পঞ্চগব্য / পঞ্চামৃত", count: 40 },
      { name: "যজ্ঞের উপকরণ", count: 40 }
    ]
  },
];

const NAV_LINKS = ["Home", "Discounts", "Flash Sale", "Wholesale", "Buy 1 Get 1", "1-99 shop", "Hot Offers", "GiveWays"];

const LAPTOP_PRODUCTS = [
  { id: 1, name: "Gonesh Murti", category: "Consumer Laptops", price: 52000, oldPrice: 58000, rating: 4.5, reviews: 128, badge: "New", badgeColor: "bg-emerald-500", img: <Laptop size={56} />, specs: { cpu: "Intel Core i5", ram: "8GB DDR5", ssd: "512GB", display: '15.6"', gpu: "Integrated", os: "Windows 11" }, inStock: true, brand: "Lenovo" },
  { id: 2, name: "Bel Patta", category: "Gaming Laptops", price: 125000, oldPrice: 138000, rating: 4.8, reviews: 89, badge: "Hot", badgeColor: "bg-rose-500", img: <Laptop size={56} />, specs: { cpu: "Intel Core i7", ram: "16GB DDR5", ssd: "1TB", display: '15.6" 144Hz', gpu: "RTX 4060 8GB", os: "Windows 11" }, inStock: true, brand: "Lenovo" },
  { id: 3, name: "Lal Candan", category: "Business Laptops", price: 95000, oldPrice: null, rating: 4.7, reviews: 54, badge: "Business", badgeColor: "bg-blue-600", img: <Laptop size={56} />, specs: { cpu: "Intel Core i7 13th Gen", ram: "16GB DDR4", ssd: "512GB", display: '14" IPS', gpu: "Integrated", os: "Windows 11 Pro" }, inStock: true, brand: "Lenovo" },
  { id: 4, name: "Lenovo Yoga 9i 2-in-1 OLED", category: "Premium Ultrabook Laptops", price: 175000, oldPrice: 195000, rating: 4.9, reviews: 37, badge: "Premium", badgeColor: "bg-amber-500", img: <Laptop size={56} />, specs: { cpu: "Intel Core Ultra 7", ram: "16GB LPDDR5", ssd: "1TB", display: '14" OLED Touch', gpu: "Intel Arc", os: "Windows 11" }, inStock: true, brand: "Lenovo" },
  { id: 5, name: "Lenovo IdeaPad Gaming 3i 15IAH7", category: "Gaming Laptops", price: 88000, oldPrice: 98000, rating: 4.4, reviews: 112, badge: "Sale", badgeColor: "bg-orange-500", img: <Laptop size={56} />, specs: { cpu: "Intel Core i5 12th Gen", ram: "8GB DDR4", ssd: "512GB", display: '15.6" 120Hz', gpu: "RTX 3050 4GB", os: "Windows 11" }, inStock: true, brand: "Lenovo" },
  { id: 6, name: "Lenovo V15 G4 IRU Business", category: "Business Laptops", price: 48000, oldPrice: 53000, rating: 4.2, reviews: 76, badge: null, badgeColor: null, img: <Laptop size={56} />, specs: { cpu: "Intel Core i3 13th Gen", ram: "8GB DDR4", ssd: "256GB", display: '15.6" TN', gpu: "Integrated", os: "Free DOS" }, inStock: true, brand: "Lenovo" },
  { id: 7, name: "Lenovo ThinkBook 16 G6 IRL", category: "Business Laptops", price: 115000, oldPrice: 125000, rating: 4.6, reviews: 43, badge: "New", badgeColor: "bg-emerald-500", img: <Laptop size={56} />, specs: { cpu: "Intel Core i7 13th Gen", ram: "16GB DDR5", ssd: "512GB", display: '16" IPS', gpu: "Integrated", os: "Windows 11" }, inStock: false, brand: "Lenovo" },
  { id: 8, name: "Lenovo LOQ 16IRX9 Gaming", category: "Gaming Laptops", price: 155000, oldPrice: 168000, rating: 4.7, reviews: 29, badge: "Hot", badgeColor: "bg-rose-500", img: <Laptop size={56} />, specs: { cpu: "Intel Core i9 14th Gen", ram: "32GB DDR5", ssd: "1TB", display: '16" 165Hz WQHD', gpu: "RTX 4070 8GB", os: "Windows 11" }, inStock: true, brand: "Lenovo" },
  { id: 9, name: "Lenovo IdeaPad Slim 5i 14IRU9", category: "Consumer Laptops", price: 68000, oldPrice: 75000, rating: 4.3, reviews: 91, badge: null, badgeColor: null, img: <Laptop size={56} />, specs: { cpu: "Intel Core i5 13th Gen", ram: "16GB DDR5", ssd: "512GB", display: '14" IPS', gpu: "Integrated", os: "Windows 11" }, inStock: true, brand: "Lenovo" },
  { id: 10, name: "Lenovo Yoga Slim 7x Snapdragon", category: "Premium Ultrabook Laptops", price: 145000, oldPrice: null, rating: 4.8, reviews: 22, badge: "New", badgeColor: "bg-emerald-500", img: <Zap size={56} />, specs: { cpu: "Snapdragon X Plus", ram: "16GB LPDDR5", ssd: "512GB", display: '14.5" OLED', gpu: "Adreno GPU", os: "Windows 11" }, inStock: true, brand: "Lenovo" },
  { id: 11, name: "Lenovo IdeaPad 1 15AMN7", category: "Consumer Laptops", price: 35849, oldPrice: 40000, rating: 3.9, reviews: 145, badge: "Budget", badgeColor: "bg-teal-500", img: <Laptop size={56} />, specs: { cpu: "AMD Athlon Silver", ram: "8GB DDR4", ssd: "256GB", display: '15.6"', gpu: "Integrated", os: "Free DOS" }, inStock: true, brand: "Lenovo" },
  { id: 12, name: "Lenovo Legion 5 Pro 16IRX9", category: "Gaming Laptops", price: 210000, oldPrice: 235000, rating: 4.9, reviews: 18, badge: "Top", badgeColor: "bg-purple-600", img: <Laptop size={56} />, specs: { cpu: "Intel Core i9 14th Gen", ram: "32GB DDR5", ssd: "2TB", display: '16" Mini-LED 240Hz', gpu: "RTX 4080 12GB", os: "Windows 11" }, inStock: true, brand: "Lenovo" },
  { id: 13, name: "Pitoler Small Prodip", category: "পূজার উপকরণ", price: 500, oldPrice: null, rating: 4.5, reviews: 128, badge: "New", badgeColor: "bg-emerald-500", img: <Star size={56} />, specs: { cpu: "N/A", ram: "N/A", ssd: "N/A", display: 'N/A', gpu: "N/A", os: "N/A" }, inStock: true, brand: "Pitoler" },
];

const FILTER_GROUPS = {
  series: { label: "Series", options: ["Consumer Laptops", "Business Laptops", "Gaming Laptops", "Premium Ultrabook Laptops"] },
  processor: { label: "Processor Type", options: ["Intel", "AMD", "Snapdragon"] },
  ram: { label: "RAM Size", options: ["8 GB", "16 GB", "32 GB", "64 GB"] },
  ssd: { label: "SSD", options: ["256 GB", "512 GB", "1 TB", "2 TB"] },
  display: { label: "Display Size", options: ["13-Inch", "14-Inch", "15-Inch", "16-Inch"] },
  os: { label: "Operating System", options: ["Free DOS", "Windows"] },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const Stars = ({ rating, size = "text-sm" }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className={`inline-flex items-center gap-0.5 ${size}`}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < full ? "text-amber-400" : (i === full && half ? "text-amber-300" : "text-gray-300")}>★</span>
      ))}
    </span>
  );
};

const fmt = (n) => "৳ " + n.toLocaleString("en-BD");

// ─── PRODUCT DETAIL PAGE ─────────────────────────────────────────────────────

function ProductDetailPage({ product, allProducts, cart, wishlist, onAddCart, onWishlist, onBack }) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const wishlisted = wishlist.includes(product.id);

  const relatedProducts = useMemo(() => {
    return allProducts
      .filter(p => p.id !== product.id && p.category === product.category)
      .concat(allProducts.filter(p => p.id !== product.id && p.category !== product.category))
      .slice(0, 4);
  }, [product, allProducts]);

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
  const images = product.sellerImages || [product.img];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) onAddCart(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .fade-up-d1 { animation: fadeUp 0.4s 0.1s ease both; }
        .fade-up-d2 { animation: fadeUp 0.4s 0.2s ease both; }
        .fade-up-d3 { animation: fadeUp 0.4s 0.3s ease both; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back button + breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 fade-up">
          <button onClick={onBack} className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 font-semibold transition group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </button>
          <span>›</span>
          <span className="hover:text-rose-500 cursor-pointer" onClick={onBack}>{product.category}</span>
          <span>›</span>
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Images */}
          <div className="fade-up-d1">
            {/* Main image */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-3 aspect-square flex items-center justify-center relative group">
              <span className="text-[140px] select-none transition-transform duration-300 group-hover:scale-110 text-slate-400">
                {images[selectedImageIdx]}
              </span>
              {product.badge && (
                <span className={`absolute top-4 left-4 ${product.badgeColor} text-white text-sm font-bold px-3 py-1.5 rounded-full shadow`}>
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="absolute top-4 right-4 bg-emerald-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow">
                  -{discount}%
                </span>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <span className="bg-gray-800 text-white font-bold px-6 py-3 rounded-xl text-lg">Out of Stock</span>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={() => setSelectedImageIdx(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow flex items-center justify-center hover:bg-white transition opacity-0 group-hover:opacity-100">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setSelectedImageIdx(i => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow flex items-center justify-center hover:bg-white transition opacity-0 group-hover:opacity-100">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImageIdx(idx)}
                  className={`flex-1 aspect-square rounded-xl border-2 flex items-center justify-center text-slate-400 transition-all bg-white ${selectedImageIdx === idx ? "border-rose-500 shadow-md shadow-rose-100" : "border-gray-200 hover:border-gray-300"}`}>
                  <span className="scale-75">{img}</span>
                </button>
              ))}
            </div>

            {/* Seller note */}
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2">
              <Camera size={16} className="text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-700 font-medium">Photos uploaded by seller — actual product may vary slightly</p>
            </div>
          </div>

          {/* Product Info */}
          <div className="fade-up-d2 flex flex-col gap-5">
            {/* Title & rating */}
            <div>
              <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mb-2">{product.category}</p>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">{product.name}</h1>
              <div className="flex items-center gap-3">
                <Stars rating={product.rating} size="text-lg" />
                <span className="text-sm text-gray-600 font-medium">{product.rating} / 5</span>
                <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-black text-slate-900">{fmt(product.price)}</span>
                {product.oldPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">{fmt(product.oldPrice)}</span>
                    <span className="bg-emerald-100 text-emerald-700 font-bold text-sm px-3 py-1 rounded-full">Save {fmt(product.oldPrice - product.price)}</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">Inclusive of all taxes • Free delivery available</p>
            </div>

            {/* Specs */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Specifications</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="bg-white border border-gray-200 rounded-xl p-3 hover:border-rose-200 transition">
                    <span className="text-xs text-gray-400 capitalize block">{k}</span>
                    <span className="text-sm font-bold text-gray-800">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity + actions */}
            <div className="space-y-3">
              {/* Stock status */}
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${product.inStock ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`} />
                <span className={`text-sm font-semibold ${product.inStock ? "text-emerald-600" : "text-gray-500"}`}>
                  {product.inStock ? "In Stock — Ready to ship" : "Out of Stock"}
                </span>
              </div>

              {/* Qty selector */}
              {product.inStock && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">Qty:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition text-gray-600">
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-800">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition text-gray-600">
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">Total: <strong className="text-slate-800">{fmt(product.price * quantity)}</strong></span>
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-rose-100 hover:shadow-rose-200 flex items-center justify-center gap-2 text-base"
                >
                  <ShoppingCart size={20} />
                  {product.inStock ? "Add to Cart" : "Unavailable"}
                </button>
                <button
                  onClick={() => onWishlist(product.id)}
                  className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${wishlisted ? "bg-rose-50 border-rose-400 text-rose-500 shadow-md" : "border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-400 hover:bg-rose-50"}`}
                >
                  <Heart size={20} className={wishlisted ? "fill-rose-500" : ""} />
                </button>
              </div>
            </div>

            {/* Service badges */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <Truck size={16} />, text: "Free Delivery over ৳5,000" },
                { icon: <RotateCcw size={16} />, text: "7-Day Easy Returns" },
                { icon: <Shield size={16} />, text: "Secure Payment" },
                { icon: <Package size={16} />, text: "Original Product" },
              ].map(s => (
                <div key={s.text} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                  <span className="text-rose-400">{s.icon}</span>
                  <span className="text-xs text-gray-600 font-medium">{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Description / Reviews */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-10 fade-up-d3">
          <div className="flex border-b border-gray-200">
            {["description", "specifications", "reviews"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-bold capitalize transition border-b-2 -mb-px ${activeTab === tab ? "border-rose-500 text-rose-500" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === "description" && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">About this product</h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-4">{product.description}</p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Brand</p>
                  <p className="text-sm text-blue-800 font-medium">{product.brand}</p>
                </div>
              </div>
            )}
            {activeTab === "specifications" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([k, v], i) => (
                      <tr key={k} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-4 py-3 font-semibold text-gray-500 capitalize w-40">{k}</td>
                        <td className="px-4 py-3 text-gray-800 font-medium">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                  <div className="text-center">
                    <div className="text-5xl font-black text-slate-900">{product.rating}</div>
                    <Stars rating={product.rating} size="text-xl" />
                    <div className="text-xs text-gray-500 mt-1">{product.reviews} reviews</div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map(star => {
                      const pct = star === Math.round(product.rating) ? 65 : star === Math.round(product.rating) - 1 ? 25 : star > product.rating ? 0 : 10;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500 w-2">{star}</span>
                          <span className="text-amber-400">★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-amber-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-gray-400 w-6">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {[
                  { name: "Rajib Biswas", rating: 5, date: "2 days ago", text: "Excellent product! Exactly as described. Fast delivery and well packaged." },
                  { name: "Priya Das", rating: 4, date: "1 week ago", text: "Very good performance. Battery life is impressive. Would recommend to others." },
                  { name: "Kartik Roy", rating: 5, date: "2 weeks ago", text: "Best purchase I have made this year. The build quality is superb." },
                ].map((review, i) => (
                  <div key={i} className="py-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-sm">{review.name[0]}</div>
                        <span className="font-semibold text-gray-800 text-sm">{review.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <Stars rating={review.rating} />
                    <p className="text-sm text-gray-600 mt-1">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="fade-up-d3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900">Related Products</h2>
            <button onClick={onBack} className="text-sm text-rose-500 hover:text-rose-600 font-semibold transition">View all →</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <RelatedProductCard key={p.id} product={p} wishlisted={wishlist.includes(p.id)} onWishlist={onWishlist} onAddCart={onAddCart} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RelatedProductCard({ product, wishlisted, onWishlist, onAddCart }) {
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-rose-200 transition-all duration-300 flex flex-col group">
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center min-h-[120px] text-slate-400">
        <span className="group-hover:scale-110 transition-transform duration-300">{product.img}</span>
        {discount && <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>}
        {product.badge && <span className={`absolute top-2 left-2 ${product.badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>{product.badge}</span>}
        <button onClick={() => onWishlist(product.id)}
          className={`absolute bottom-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center shadow text-sm opacity-0 group-hover:opacity-100 transition ${wishlisted ? "bg-rose-500 text-white" : "bg-white text-gray-400 hover:text-rose-500"}`}>
          <Heart size={14} className={wishlisted ? "fill-white" : ""} />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-rose-500 font-semibold mb-1 truncate">{product.category}</p>
        <h3 className="text-xs font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <Stars rating={product.rating} size="text-xs" />
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <div className="mt-auto">
          <span className="text-sm font-black text-slate-900 block mb-2">{fmt(product.price)}</span>
          <button onClick={() => onAddCart(product)} disabled={!product.inStock}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-xs font-bold py-2 rounded-lg transition">
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────────────

function Header({ cartCount, wishCount, onMenuOpen, searchQuery, setSearchQuery, onCartClick, user, onLogout, onMobileMenuOpen }) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:flex justify-between items-center">
        <span>Free delivery on orders above <b className="text-amber-400">৳ 5,000</b></span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition">Track Order</a>
          <a href="#" className="text-green-400 hover:text-white transition">Become a Seller</a>
          <a href="#" className="text-blue-400 hover:text-white transition">Help</a>
        </div>
      </div>

      <div className="bg-gray-100 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 lg:gap-6">
          <button onClick={onMenuOpen} className="lg:hidden p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-slate-700">
            <SlidersHorizontal size={20} />
          </button>

          <a href="#" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-400 rounded-lg flex items-center justify-center text-white font-black text-sm">P</div>
              <span className="font-black text-slate-900 text-lg hidden sm:block tracking-tight">PARASH FERI</span>
            </div>
          </a>

          <div
            className={`relative flex-1 flex items-center border-2 rounded-xl overflow-hidden transition-all duration-100 ${
              searchFocused ? "border-[#088178] shadow-lg shadow-gray-200/50" : "border-gray-200"
            }`}
          >
            <select className="hidden md:block bg-gray-50 border-r border-gray-300 px-3 py-2.5 text-xs text-gray-600 font-medium focus:outline-none cursor-pointer">
              <option value="Categories">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id}>{c.label}</option>
              ))}
            </select>

            <input
              type="search"
              placeholder="Search.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="flex-1 w-full px-5 pr-12 py-2.5 text-sm text-gray-700 focus:outline-none bg-white"
            />

            <button
              onClick={() => {}}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[#088178] transition"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Desktop action icons */}
          <div className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-600">
            <Link to="/" className="hover:text-[#088178]">Home</Link>
            <Link to="/shop" className="text-[#088178] transition">Shop</Link>

            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-100">
              <Link to="/favorites" className="hover:text-red-500 transition relative">
                <Heart size={20} />
                {user?.favorites?.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center animate-bounce">
                    {user.favorites.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="hover:text-[#088178] transition relative mr-4">
                <ShoppingCart size={22} />
                {user?.cart?.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#088178] text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {user.cart.length}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition shadow-sm">
                    <User size={20} />
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="p-2 bg-teal-50 text-[#088178] rounded-xl hover:bg-teal-100 transition">
                      <Settings size={20} />
                    </Link>
                  )}
                  {user.role === 'seller' && (
                    <Link to="/seller" className="p-2 bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-100 transition">
                      <Settings size={20} />
                    </Link>
                  )}
                  <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-6 p-4 m-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 text-center"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button onClick={onMobileMenuOpen} className="md:hidden pr-1 text-gray-700">
            <Menu size={26} />
          </button>
        </div>
      </div>

      <nav className="hidden lg:block bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0">
            {NAV_LINKS.map(link => (
              <li key={link}>
                <a href="#" className="text-slate-300 hover:text-white hover:bg-slate-700 px-4 py-2.5 text-sm font-medium transition block">{link}</a>
              </li>
            ))}
            <li className="ml-auto">
              <a href="#" className="text-amber-400 hover:text-amber-300 px-4 py-2.5 text-sm font-bold transition block animate-pulse flex items-center gap-1">
                <Flame size={14} /> Flash Sale
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

function MobileMenu({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 overflow-y-auto ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-4 py-4 bg-slate-900 text-white">
          <span className="font-black text-lg">PARASH FERI</span>
          <button onClick={onClose} className="hover:text-rose-400 transition"><X size={22} /></button>
        </div>
        <ul className="py-2">
          {NAV_LINKS.map(link => (
            <li key={link} className="border-b border-gray-100">
              <a href="#" className="block px-5 py-3 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 font-medium transition">{link}</a>
            </li>
          ))}
        </ul>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Categories</p>
          {CATEGORIES.map(cat => (
            <div key={cat.id}>
              <button onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                className="w-full flex items-center justify-between py-2.5 text-sm text-gray-700 hover:text-rose-600 transition">
                <span className="flex items-center gap-2">{cat.icon} {cat.label}</span>
                <span className="text-gray-400">{expanded === cat.id ? "−" : "+"}</span>
              </button>
              {expanded === cat.id && (
                <ul className="ml-5 mb-1">
                  {cat.sub.map(s => (
                    <li key={s.name} className="flex justify-between py-1.5 text-xs text-gray-500 hover:text-rose-500 cursor-pointer border-b border-gray-100 transition">
                      <span>{s.name}</span><span className="text-gray-400">{s.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

function FilterSidebar({ filters, setFilters, priceRange, setPriceRange, onClose, isMobile }) {
  const [expanded, setExpanded] = useState(Object.keys(FILTER_GROUPS));

  const toggleFilter = (group, value) => {
    setFilters(prev => {
      const current = prev[group] || [];
      return { ...prev, [group]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] };
    });
  };

  const clearAll = () => { setFilters({}); setPriceRange([35849, 436500]); };
  const activeCount = Object.values(filters).flat().length;

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <span className="flex font-bold text-slate-800 gap-2 text-sm"><Filter size='18'/> Filters</span>
          {activeCount > 0 && <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{activeCount}</span>}
        </div>
        <div className="flex gap-2">
          {activeCount > 0 && <button onClick={clearAll} className="text-xs text-rose-500 hover:text-rose-600 font-medium transition">Clear all</button>}
          {isMobile && <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={18} /></button>}
        </div>
      </div>

      <div className="px-4 py-4 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Price Range</p>
        <div className="flex gap-2 items-center">
          <input type="number" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:border-rose-400" />
          <span className="text-gray-400 text-xs flex-shrink-0">to</span>
          <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:border-rose-400" />
        </div>
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>{fmt(priceRange[0])}</span><span>{fmt(priceRange[1])}</span>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Availability</p>
        {["In Stock", "Pre Order", "Up Coming"].map(opt => (
          <label key={opt} className="flex items-center gap-2 py-1 cursor-pointer group">
            <input type="checkbox" className="w-3.5 h-3.5 accent-rose-500" onChange={() => toggleFilter("availability", opt)} checked={(filters.availability || []).includes(opt)} />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">{opt}</span>
          </label>
        ))}
      </div>

      {Object.entries(FILTER_GROUPS).map(([key, group]) => (
        <div key={key} className="border-b border-gray-100">
          <button onClick={() => setExpanded(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{group.label}</span>
            <span className="text-gray-400 text-sm">{expanded.includes(key) ? "−" : "+"}</span>
          </button>
          {expanded.includes(key) && (
            <div className="px-4 pb-3">
              {group.options.map(opt => (
                <label key={opt} className="flex items-center gap-2 py-1 cursor-pointer group">
                  <input type="checkbox" className="w-3.5 h-3.5 accent-rose-500"
                    onChange={() => toggleFilter(key, opt)}
                    checked={(filters[key] || []).includes(opt)} />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">{opt}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProductCard({ product, onAddCart, onWishlist, wishlisted, view, onProductClick }) {
  const [hovered, setHovered] = useState(false);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  if (view === "list") {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex gap-0">
        <div onClick={() => onProductClick(product)} className="w-36 sm:w-48 flex-shrink-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative cursor-pointer text-slate-400 p-4">
          {product.img}
          {product.badge && <span className={`absolute top-2 left-2 ${product.badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>{product.badge}</span>}
          {!product.inStock && <div className="absolute inset-0 bg-white/70 flex items-center justify-center"><span className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span></div>}
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs text-rose-500 font-semibold uppercase tracking-wide mb-1">{product.category}</p>
            <h3 onClick={() => onProductClick(product)} className="font-bold text-gray-900 text-sm sm:text-base mb-2 leading-tight cursor-pointer hover:text-rose-600 transition">{product.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Stars rating={product.rating} />
              <span className="text-xs text-gray-500">({product.reviews})</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
                <span key={k} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{v}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-lg font-black text-slate-900">{fmt(product.price)}</span>
              {product.oldPrice && <span className="ml-2 text-sm text-gray-400 line-through">{fmt(product.oldPrice)}</span>}
              {discount && <span className="ml-2 text-xs text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">-{discount}%</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => onWishlist(product.id)} className={`p-2 rounded-lg border transition ${wishlisted ? "bg-rose-50 border-rose-300 text-rose-500" : "border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-400"}`}>
                <Heart size={16} className={wishlisted ? "fill-rose-500" : ""} />
              </button>
              <button onClick={() => onAddCart(product)} disabled={!product.inStock}
                className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-lg transition">
                {product.inStock ? "Add to Cart" : "Unavailable"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-rose-200 transition-all duration-300 flex flex-col group"
    >
      <div onClick={() => onProductClick(product)} className="relative bg-gradient-to-br from-slate-50 to-slate-100 pt-4 pb-2 px-4 flex items-center justify-center min-h-[160px] cursor-pointer text-slate-400">
        <span className={`transition-transform duration-300 ${hovered ? "scale-110" : "scale-100"}`}>{product.img}</span>
        {product.badge && <span className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm`}>{product.badge}</span>}
        {discount && <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>}
        {!product.inStock && <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-t-xl"><span className="bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-full">Out of Stock</span></div>}
        <div className={`absolute top-3 right-3 flex flex-col gap-1.5 transition-all duration-200 ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"} ${discount ? "top-10" : ""}`}>
          <button onClick={e => { e.stopPropagation(); onWishlist(product.id); }} className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition ${wishlisted ? "bg-rose-500 text-white" : "bg-white text-gray-500 hover:bg-rose-50 hover:text-rose-500"}`}>
            <Heart size={14} className={wishlisted ? "fill-white" : ""} />
          </button>
          <button onClick={e => { e.stopPropagation(); onProductClick(product); }} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md hover:bg-blue-50 hover:text-blue-500 transition text-gray-500">
            <Eye size={14} />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-rose-500 font-semibold uppercase tracking-wide mb-1">{product.category}</p>
        <h3 onClick={() => onProductClick(product)} className="text-sm font-semibold text-gray-800 mb-2 leading-tight line-clamp-2 group-hover:text-slate-900 transition cursor-pointer hover:text-rose-600">{product.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <Stars rating={product.rating} />
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        <div className="grid grid-cols-2 gap-1 mb-3">
          {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
            <div key={k} className="bg-gray-50 rounded-lg px-2 py-1">
              <span className="text-xs text-gray-500 capitalize block leading-none">{k}</span>
              <span className="text-xs font-semibold text-gray-700 truncate block">{v}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-slate-900">{fmt(product.price)}</span>
            {product.oldPrice && <span className="text-xs text-gray-400 line-through">{fmt(product.oldPrice)}</span>}
          </div>
          <button onClick={() => onAddCart(product)} disabled={!product.inStock}
            className="w-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-rose-200 hover:shadow-md flex items-center justify-center gap-2">
            <ShoppingCart size={16} />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartToast({ item, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [item]);

  if (!item) return null;
  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 flex items-center gap-3 p-4 animate-slide-in">
      <span className="text-slate-400">{item.img}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> Added to cart</p>
        <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
        <p className="text-sm font-black text-rose-500">{fmt(item.price)}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0"><X size={16} /></button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [sortBy, setSortBy] = useState("best");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartToast, setCartToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeSidebarCat, setActiveSidebarCat] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 0) { setIsHidden(false); return; }
      if (currentScrollY > lastScrollY + 5) setIsHidden(true);
      else if (currentScrollY < lastScrollY - 5) setIsHidden(false);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const PER_PAGE = 9;

  const filteredProducts = useMemo(() => {
    let list = [...LAPTOP_PRODUCTS];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || Object.values(p.specs).some(v => v.toLowerCase().includes(q)));
    }
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (filters.series?.length) list = list.filter(p => filters.series.includes(p.category));
    if (filters.processor?.length) list = list.filter(p => filters.processor.some(proc => p.specs.cpu.toLowerCase().includes(proc.toLowerCase())));
    if (filters.ram?.length) list = list.filter(p => filters.ram.some(r => p.specs.ram.includes(r.replace(" GB", ""))));
    if (filters.ssd?.length) list = list.filter(p => filters.ssd.some(s => p.specs.ssd.toLowerCase().includes(s.toLowerCase().replace(" gb", "gb").replace(" tb", "tb"))));
    if (filters.os?.length) list = list.filter(p => filters.os.some(os => p.specs.os.toLowerCase().includes(os.toLowerCase())));
    if (filters.availability?.includes("In Stock")) list = list.filter(p => p.inStock);
    switch (sortBy) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "reviews": list.sort((a, b) => b.reviews - a.reviews); break;
      default: break;
    }
    return list;
  }, [searchQuery, filters, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      return exists ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...product, qty: 1 }];
    });
    setCartToast(product);
  };

  const toggleWishlist = (id) => setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => { setPage(1); }, [searchQuery, filters, priceRange, sortBy]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const activeFilterCount = Object.values(filters).flat().length;

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slide-in { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.3s ease; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .fade-up-d1 { animation: fadeUp 0.4s 0.05s ease both; }
        .fade-up-d2 { animation: fadeUp 0.4s 0.15s ease both; }
        .fade-up-d3 { animation: fadeUp 0.4s 0.25s ease both; }
      `}</style>

      <Header
        cartCount={cartCount}
        wishCount={wishlist.length}
        onMenuOpen={() => setMobileMenuOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCartClick={() => {}}
        user={user}
        onLogout={handleLogout}
        onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
      />

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Product Detail Page */}
      {selectedProduct ? (
        <ProductDetailPage
          product={selectedProduct}
          allProducts={LAPTOP_PRODUCTS}
          cart={cart}
          wishlist={wishlist}
          onAddCart={addToCart}
          onWishlist={toggleWishlist}
          onBack={handleBack}
        />
      ) : (
        <>
          {/* Mobile Filter Drawer */}
          <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${mobileFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setMobileFilterOpen(false)} />
          <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 overflow-y-auto lg:hidden ${mobileFilterOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <FilterSidebar filters={filters} setFilters={setFilters} priceRange={priceRange} setPriceRange={setPriceRange} onClose={() => setMobileFilterOpen(false)} isMobile />
          </aside>

          <main className="max-w-7xl mx-auto px-4 py-6">
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <a href="/home" className="hover:text-rose-500 transition">Home</a>
              <span>›</span>
              <span className="text-gray-800 font-medium">All Products</span>
            </nav>

              


            <div className="flex gap-6">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4 shadow-sm">
                  <div className="px-4 py-3 bg-slate-800 text-white">
                    <h2 className="font-bold text-sm">Categories</h2>
                  </div>
                  {CATEGORIES.map(cat => (
                    <div key={cat.id} className="border-b border-gray-100 last:border-0">
                      <button onClick={() => setActiveSidebarCat(activeSidebarCat === cat.id ? null : cat.id)}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-rose-50 transition text-left">
                        <span className="flex items-center gap-2 text-sm text-gray-700 font-medium">{cat.icon}{cat.label}</span>
                        <span className="text-xs text-gray-400">{activeSidebarCat === cat.id ? "−" : "+"}</span>
                      </button>
                      {activeSidebarCat === cat.id && (
                        <ul className="bg-gray-50 border-t border-gray-100">
                          {cat.sub.map(s => (
                            <li key={s.name} className="flex justify-between px-6 py-1.5 text-xs text-gray-500 hover:text-rose-500 cursor-pointer hover:bg-white transition border-b border-gray-100 last:border-0">
                              <span>{s.name}</span><span className="text-gray-300">{s.count}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <FilterSidebar filters={filters} setFilters={setFilters} priceRange={priceRange} setPriceRange={setPriceRange} onClose={() => {}} isMobile={false} />
                </div>
              </aside>

              {/* Product area */}
              <div className="flex-1 min-w-0">
                {/* Toolbar */}
                <div className="bg-gray-200 border border-gray-200 rounded px-2 py-2 flex flex-wrap items-center gap-1 mb-4 shadow-sm">
                  <button onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-1 bg-slate-800 text-white text-[14px] p-1 px-2 rounded-lg">
                    <Filter size={15} /> Filters {activeFilterCount > 0 && <span className="bg-rose-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
                  </button>
                  <p className="text-sm ml-4 text-gray-800 hidden sm:block">{filteredProducts.length} results</p>
                  <div className="ml-auto flex items-center gap-3 flex-wrap">
                    <div className="text-center">
                      <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        className="border border-gray-400 rounded-lg px-1 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-rose-400 cursor-pointer">
                        <option value="best">Best Deal</option>
                        <option value="price-asc">Price: Low → High</option>
                        <option value="price-desc">Price: High → Low</option>
                        <option value="rating">Top Rated</option>
                        <option value="reviews">Most Reviews</option>
                      </select>
                    </div>
                    <div className="flex border border-gray-400 rounded-lg overflow-hidden">
                      <button onClick={() => setView("grid")} className={`px-3 py-1.5 transition flex items-center ${view === "grid" ? "bg-slate-800 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                        <Grid size={16} />
                      </button>
                      <button onClick={() => setView("list")} className={`px-3 py-1.5 transition flex items-center ${view === "list" ? "bg-slate-800 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                        <List size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Active filters */}
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-green-100/50 text-green-600 border border-green-400 text-xs font-medium items-center justify-right align-right  rounded-xl">{filteredProducts.length} results found</span>
                    {Object.entries(filters).map(([group, values]) =>
                      (values || []).map(val => (
                        <span key={`${group}-${val}`} className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium px-3 py-1 rounded-full">
                          {val}
                          <button onClick={() => setFilters(prev => ({ ...prev, [group]: prev[group].filter(v => v !== val) }))} className="hover:text-rose-800 transition">
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                )}

                {/* Products */}
                {paginatedProducts.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
                    <Search size={48} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-bold text-gray-700 mb-2">No products found</h3>
                    <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search query</p>
                    <button onClick={() => { setFilters({}); setSearchQuery(""); setPriceRange([35849, 436500]); }}
                      className="bg-rose-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-600 transition">
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4" : "flex flex-col gap-3"}>
                    {paginatedProducts.map(product => (
                      <ProductCard key={product.id} product={product} view={view}
                        onAddCart={addToCart} onWishlist={toggleWishlist}
                        wishlisted={wishlist.includes(product.id)}
                        onProductClick={handleProductClick} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                      ← Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition ${page === i + 1 ? "bg-rose-500 text-white shadow-md shadow-rose-200" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Service banner */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <Truck size={28} />, title: "Free Delivery", desc: "On orders above ৳5,000" },
                { icon: <RotateCcw size={28} />, title: "Easy Returns", desc: "7-day return policy" },
                { icon: <Shield size={28} />, title: "Secure Payment", desc: "100% safe transactions" },
                { icon: <Package size={28} />, title: "24/7 Support", desc: "Dedicated customer care" },
              ].map(s => (
                <div key={s.title} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition">
                  <span className="text-rose-400">{s.icon}</span>
                  <div><p className="text-sm font-bold text-gray-800">{s.title}</p><p className="text-xs text-gray-500">{s.desc}</p></div>
                </div>
              ))}
            </div>
          </main>
        </>
      )}

      {/* Footer */}
      <Footer className="grid grid-cols-2"></Footer>

      {/* Mobile Slide Menu */}
      <div className={`fixed inset-y-0 right-0 w-[300px] h-[200vh] bg-white z-[1200] transition-transform duration-200 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-white">
          <div className="bg-white flex items-right justify-end">
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-5 text-gray-400 hover:text-red-500"><X size={28} /></button>
          </div>

          <ul className="bg-white p-20 px-10 space-y-6">
            <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-2xl font-black text-gray-800"><House size={28} />Home</Link></li>
            <li><Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-2xl font-black text-[#088178]"><ShoppingCart size={28} />Shop</Link></li>
            <li>
              <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-2xl font-black text-gray-800">
                <Heart size={28} /> Wishlist
                {user?.favorites?.length > 0 && <span className="bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{user.favorites.length}</span>}
              </Link>
            </li>
            <li>
              <Link to="/cart" className="flex items-center gap-2 text-2xl font-black text-gray-800 relative" onClick={() => setIsMobileMenuOpen(false)}>
                <ShoppingBag size={28} /> Cart
                {user?.cart?.length > 0 && <span className="bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{user.cart.length}</span>}
              </Link>
            </li>

            <hr className="border-gray-50" />
            {user ? (
              <>
                <li><Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-2xl font-black text-gray-800"><User size={28} /> My Profile</Link></li>
                {user.role === 'admin' && <li><Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-teal-600"><Settings size={20} /> Administration</Link></li>}
                {user.role === 'seller' && <li><Link to="/seller" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-orange-500"><Settings size={20} /> Seller Panel</Link></li>}
                <li className="pt-4">
                  <button onClick={handleLogout} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black flex items-center justify-center gap-2">
                    <LogOut size={20} /> Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 text-center">
                  Get Started
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-400 flex lg:hidden z-30 shadow-2xl">
        {[
          { icon: <House size={20} />, src:"/", label: "Home" },
          { icon: <Search size={20} />, label: "Search" },
          { icon: <ShoppingCart size={20} />, label: "Cart", count: cartCount },
          { icon: <Heart size={20} />, label: "Wishlist", count: wishlist.length },
          { icon: <Package size={20} />, label: "Order" },
        ].map(item => (
          <button key={item.label} className="flex-1 flex flex-col bg-white items-center justify-center py-2 gap-0.5 relative hover:bg-gray-200 transition">
            <span className="text-gray-600">{item.icon}</span>
            <span className="text-xs text-gray-500 font-medium">{item.label}</span>
            {item.count > 0 && <span className="absolute top-1 right-1/4 bg-rose-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">{item.count}</span>}
          </button>
        ))}
      </nav>

      {cartToast && <CartToast item={cartToast} onClose={() => setCartToast(null)} />}
      <div className="h-16 lg:hidden" />
    </div>
  );
}