const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Plant = require('../models/Plant');
const auth = require('../middleware/auth');

// Get User Cart
router.get('/', auth('user'), async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate({
            path: 'items.plant',
            populate: { path: 'shop', select: 'shopName image' }
        });

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [], totalAmount: 0 });
            await cart.save();
        }

        res.json(cart);
    } catch (err) {
        console.error('Fetch cart error:', err);
        res.status(500).json({ message: 'Server error fetching cart' });
    }
});

// Add Item to Cart
router.post('/add', auth('user'), async (req, res) => {
    try {
        const { plantId, quantity = 1 } = req.body;
        const plant = await Plant.findById(plantId);

        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }

        if (!plant.inStock || plant.stockQuantity < quantity) {
            return res.status(400).json({ message: 'Plant is currently out of stock or insufficient quantity' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [], totalAmount: 0 });
        }

        const existingItemIndex = cart.items.findIndex(item => item.plant.toString() === plantId);
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                plant: plantId,
                quantity: quantity,
                price: plant.price
            });
        }

        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate({
            path: 'items.plant',
            populate: { path: 'shop', select: 'shopName image' }
        });

        res.json({ message: 'Added to cart successfully', cart: populatedCart });
    } catch (err) {
        console.error('Add cart item error:', err);
        res.status(500).json({ message: 'Error adding item to cart' });
    }
});

// Update Cart Item Quantity
router.put('/update', auth('user'), async (req, res) => {
    try {
        const { plantId, quantity } = req.body;
        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.plant.toString() === plantId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate({
            path: 'items.plant',
            populate: { path: 'shop', select: 'shopName image' }
        });

        res.json({ message: 'Cart updated', cart: populatedCart });
    } catch (err) {
        res.status(500).json({ message: 'Error updating cart item' });
    }
});

// Remove Item from Cart
router.delete('/remove/:plantId', auth('user'), async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.plant.toString() !== req.params.plantId);
        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate({
            path: 'items.plant',
            populate: { path: 'shop', select: 'shopName image' }
        });

        res.json({ message: 'Item removed from cart', cart: populatedCart });
    } catch (err) {
        res.status(500).json({ message: 'Error removing item from cart' });
    }
});

// Clear Cart
router.delete('/clear', auth('user'), async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        if (cart) {
            cart.items = [];
            cart.totalAmount = 0;
            await cart.save();
        }
        res.json({ message: 'Cart cleared successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error clearing cart' });
    }
});

module.exports = router;
