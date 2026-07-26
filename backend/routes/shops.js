const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Shop = require('../models/Shop');
const Plant = require('../models/Plant');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_virtual_greenhouse_2026_saas';

// Register Shop
router.post('/register', upload.single('image'), async (req, res) => {
    try {
        const { shopName, email, password, phone, address, description, virtualTourPath } = req.body;
        let existingShop = await Shop.findOne({ email });
        if (existingShop) {
            return res.status(400).json({ message: 'Shop with this email already exists' });
        }

        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            imageUrl = req.body.image;
        }

        const shop = new Shop({
            shopName,
            email,
            password,
            phone,
            address,
            description,
            image: imageUrl,
            virtualTourPath: virtualTourPath || ''
        });

        await shop.save();

        const token = jwt.sign({ id: shop._id, role: 'shop' }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            shop: {
                id: shop._id,
                shopName: shop.shopName,
                email: shop.email,
                phone: shop.phone,
                address: shop.address,
                description: shop.description,
                image: shop.image,
                virtualTourPath: shop.virtualTourPath,
                role: 'shop'
            }
        });
    } catch (err) {
        console.error('Register shop error:', err);
        res.status(500).json({ message: 'Server error during shop registration' });
    }
});

// Login Shop
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const shop = await Shop.findOne({ email });
        if (!shop) {
            return res.status(400).json({ message: 'Invalid shop credentials' });
        }

        const isMatch = await shop.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid shop credentials' });
        }

        const token = jwt.sign({ id: shop._id, role: 'shop' }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            shop: {
                id: shop._id,
                shopName: shop.shopName,
                email: shop.email,
                phone: shop.phone,
                address: shop.address,
                description: shop.description,
                image: shop.image,
                virtualTourPath: shop.virtualTourPath,
                role: 'shop'
            }
        });
    } catch (err) {
        console.error('Login shop error:', err);
        res.status(500).json({ message: 'Server error during shop login' });
    }
});

// Get All Shops (Public)
router.get('/', async (req, res) => {
    try {
        const shops = await Shop.find().select('-password');
        res.json(shops);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching shops' });
    }
});

// Get Shop Details & Inventory by ID (Public)
router.get('/:id', async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).select('-password');
        if (!shop) return res.status(404).json({ message: 'Nursery not found' });

        const plants = await Plant.find({ shop: shop._id });
        res.json({ shop, plants });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching nursery details' });
    }
});

// Get Current Logged-in Shop Profile
router.get('/profile/me', auth('shop'), async (req, res) => {
    try {
        const shop = await Shop.findById(req.user.id).select('-password');
        if (!shop) return res.status(404).json({ message: 'Shop profile not found' });
        res.json(shop);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching shop profile' });
    }
});

// Update Shop Profile
router.put('/profile/me', auth('shop'), upload.single('image'), async (req, res) => {
    try {
        const shop = await Shop.findById(req.user.id);
        if (!shop) return res.status(404).json({ message: 'Shop not found' });

        const { shopName, phone, address, description, virtualTourPath } = req.body;
        if (shopName) shop.shopName = shopName;
        if (phone !== undefined) shop.phone = phone;
        if (address !== undefined) shop.address = address;
        if (description !== undefined) shop.description = description;
        if (virtualTourPath !== undefined) shop.virtualTourPath = virtualTourPath;

        if (req.file) {
            shop.image = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            shop.image = req.body.image;
        }

        await shop.save();
        res.json({ message: 'Shop profile updated', shop });
    } catch (err) {
        res.status(500).json({ message: 'Error updating shop profile' });
    }
});

module.exports = router;
