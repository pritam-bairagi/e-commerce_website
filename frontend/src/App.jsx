import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import Home from './pages/Home';
import Shop from './pages/Shop';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EmailVerification from './pages/EmailVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import SellerRegister from './pages/SellerRegister';
import CourierRegister from './pages/CourierRegister';
import SellerPanel from './pages/SellerPanel';

import FloatingShape from './components/FloatingShape';

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#088178]"></div>
    </div>
  );

  if (!user) return <Navigate to='/login' replace />;

  return children;
};

// redirect authenticated users to the home page (only for login/register pages)
const RedirectAuthenticatedUser = ({ children }) => {
  const { user } = useAuth();
  if (user && user.isVerified) {
    return <Navigate to='/' replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#088178]"></div>
    </div>
  );

  if (!user || user.role !== 'admin') {
    return <Navigate to='/' replace />;
  }

  return children;
};

// Seller Route protection
const SellerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );

  if (!user || user.role !== 'seller') {
    return <Navigate to='/' replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* E-commerce Style Pages (Light Background) */}
          <Route path='/' element={<Home />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path='/favorites' element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path='/dashboard' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/admin' element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path='/seller' element={<SellerRoute><SellerPanel /></SellerRoute>} />

          {/* Auth Pages (Dark Background with Floating Shapes) */}
          <Route
            path='/login'
            element={
              <RedirectAuthenticatedUser>
                <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 flex items-center justify-center relative overflow-hidden'>
                  <FloatingShape color='bg-indigo-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
                  <FloatingShape color='bg-purple-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
                  <Login />
                </div>
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path='/register'
            element={
              <RedirectAuthenticatedUser>
                <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 flex items-center justify-center relative overflow-hidden'>
                  <FloatingShape color='bg-indigo-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
                  <FloatingShape color='bg-blue-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
                  <Register />
                </div>
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path='/seller-signup'
            element={
              <RedirectAuthenticatedUser>
                <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 flex items-center justify-center relative overflow-hidden'>
                  <FloatingShape color='bg-teal-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
                  <FloatingShape color='bg-emerald-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
                  <SellerRegister />
                </div>
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path='/courier'
            element={
              <RedirectAuthenticatedUser>
                <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 flex items-center justify-center relative overflow-hidden'>
                  <FloatingShape color='bg-orange-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
                  <FloatingShape color='bg-red-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
                  <CourierRegister />
                </div>
              </RedirectAuthenticatedUser>
            }
          />
          <Route path='/verify-email' element={<EmailVerification />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />

          {/* catch all routes */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
        <Toaster position='top-right' />
      </Router>
    </AuthProvider>
  );
};

export default App;
