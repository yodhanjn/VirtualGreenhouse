const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Plant = require('../models/Plant');
const auth = require('../middleware/auth');

// Create Order (Checkout)
router.post('/checkout', auth('user'), async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({ message: 'Shipping address and payment method are required' });
        }

        const cart = await Cart.findOne({ user: req.user.id }).populate({
            path: 'items.plant',
            populate: { path: 'shop' }
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Shopping cart is empty' });
        }

        // Group items by shop to create distinct orders for each nursery seller
        const itemsByShop = {};
        for (const item of cart.items) {
            if (!item.plant || !item.plant.shop) continue;
            const shopId = item.plant.shop._id.toString();
            if (!itemsByShop[shopId]) {
                itemsByShop[shopId] = [];
            }
            itemsByShop[shopId].push(item);
        }

        const createdOrders = [];

        for (const shopId in itemsByShop) {
            const shopItems = itemsByShop[shopId];
            let shopTotal = 0;
            const orderItems = [];

            for (const item of shopItems) {
                const subtotal = item.price * item.quantity;
                shopTotal += subtotal;

                orderItems.push({
                    plant: item.plant._id,
                    plantName: item.plant.name,
                    plantImage: item.plant.image,
                    quantity: item.quantity,
                    price: item.price
                });

                // Deduct plant stock quantity
                await Plant.findByIdAndUpdate(item.plant._id, {
                    $inc: { stockQuantity: -item.quantity }
                });
            }

            const order = new Order({
                user: req.user.id,
                shop: shopId,
                items: orderItems,
                totalAmount: shopTotal,
                shippingAddress,
                paymentMethod,
                status: 'Pending'
            });

            await order.save();
            createdOrders.push(order);
        }

        // Clear user cart after checkout
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json({
            message: 'Order placed successfully',
            orders: createdOrders
        });
    } catch (err) {
        console.error('Checkout error:', err);
        res.status(500).json({ message: 'Error processing order during checkout' });
    }
});

// Get Buyer's Orders History
router.get('/user', auth('user'), async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('shop', 'shopName email phone address image')
            .sort({ orderDate: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user orders' });
    }
});

// Get Shopkeeper's Orders Management List
router.get('/shop', auth('shop'), async (req, res) => {
    try {
        const orders = await Order.find({ shop: req.user.id })
            .populate('user', 'name email phone address')
            .sort({ orderDate: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching shop orders' });
    }
});

// Update Order Status (Shopkeeper authorization required)
router.put('/:id/status', auth('shop'), async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.shop.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update status for this order' });
        }

        // Terminal state checks: Cancelled and Delivered orders cannot be changed
        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: 'This order is cancelled and its status cannot be modified.' });
        }

        if (order.status === 'Delivered') {
            return res.status(400).json({ message: 'This order has been delivered and its status cannot be modified.' });
        }

        // If seller cancels the order, restore stock
        if (status === 'Cancelled' && order.status !== 'Cancelled') {
            for (const item of order.items) {
                if (item.plant) {
                    await Plant.findByIdAndUpdate(item.plant, {
                        $inc: { stockQuantity: item.quantity }
                    });
                }
            }
        }

        order.status = status;
        await order.save();

        res.json({ message: `Order status updated to ${status}`, order });
    } catch (err) {
        res.status(500).json({ message: 'Error updating order status' });
    }
});

// Buyer Cancel Order (Allowed ONLY before Shipped/Delivered)
router.put('/:id/cancel', auth('user'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        if (order.status === 'Shipped' || order.status === 'Delivered') {
            return res.status(400).json({ message: 'Order has already been shipped and cannot be cancelled.' });
        }

        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled.' });
        }

        // Restore plant stock quantities
        for (const item of order.items) {
            if (item.plant) {
                await Plant.findByIdAndUpdate(item.plant, {
                    $inc: { stockQuantity: item.quantity }
                });
            }
        }

        order.status = 'Cancelled';
        await order.save();

        res.json({ message: 'Order cancelled successfully', order });
    } catch (err) {
        console.error('Cancel order error:', err);
        res.status(500).json({ message: 'Error cancelling order' });
    }
});

module.exports = router;
