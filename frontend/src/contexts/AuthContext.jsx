import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5000/api/auth';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`${API_URL}/me`, config);
            setUser(response.data.user);
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    };

    const verify = async (verifyData) => {
        const response = await axios.post(`${API_URL}/verify`, verifyData);
        if (response.data.success && response.data.user) {
            setUser(response.data.user);
        }
        return response.data;
    };

    const forgotPassword = async (email) => {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return response.data;
    };

    const resetPassword = async (token, password) => {
        const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
        if (response.data.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            await fetchUser(response.data.token);
        }
        return response.data;
    };

    const login = async (credentials) => {
        const response = await axios.post(`${API_URL}/login`, credentials);
        if (response.data.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
        }
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            register,
            verify,
            login,
            logout,
            forgotPassword,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};
