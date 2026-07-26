import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { userType, token } = useAuth();
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!token || userType !== 'user') {
            setCart({ items: [], totalAmount: 0 });
            setCartCount(0);
            return;
        }

        try {
            setLoading(true);
            const res = await api.get('/cart');
            setCart(res.data);
            const totalCount = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalCount);
        } catch (err) {
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token, userType]);

    const addToCart = async (plantId, quantity = 1) => {
        if (!token) throw new Error('Please log in to add items to cart');
        if (userType !== 'user') throw new Error('Shop accounts cannot make plant purchases');

        try {
            const res = await api.post('/cart/add', { plantId, quantity });
            setCart(res.data.cart);
            const totalCount = res.data.cart.items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalCount);
            return res.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to add item to cart');
        }
    };

    const updateQuantity = async (plantId, quantity) => {
        try {
            const res = await api.put('/cart/update', { plantId, quantity });
            setCart(res.data.cart);
            const totalCount = res.data.cart.items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalCount);
        } catch (err) {
            console.error('Failed to update cart quantity:', err);
        }
    };

    const removeFromCart = async (plantId) => {
        try {
            const res = await api.delete(`/cart/remove/${plantId}`);
            setCart(res.data.cart);
            const totalCount = res.data.cart.items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalCount);
        } catch (err) {
            console.error('Failed to remove item from cart:', err);
        }
    };

    const clearCart = async () => {
        try {
            await api.delete('/cart/clear');
            setCart({ items: [], totalAmount: 0 });
            setCartCount(0);
        } catch (err) {
            console.error('Failed to clear cart:', err);
        }
    };

    return (
        <CartContext.Provider value={{ cart, cartCount, loading, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
