import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(localStorage.getItem('userType') || null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInitialUser = async () => {
            if (token && userType) {
                try {
                    const endpoint = userType === 'shop' ? '/shops/profile/me' : '/users/profile';
                    const res = await api.get(endpoint);
                    setUser(res.data);
                } catch (err) {
                    console.error('Failed to restore session:', err);
                    logout();
                }
            }
            setLoading(false);
        };

        loadInitialUser();
    }, [token, userType]);

    const loginUser = (data, type) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', type);
        setToken(data.token);
        setUserType(type);
        setUser(data.user || data.shop);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setToken(null);
        setUserType(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, userType, token, loading, loginUser, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
