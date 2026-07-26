const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');
const Shop = require('../models/Shop');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get All Plants (With filtering and search)
router.get('/', async (req, res) => {
    try {
        const { category, search, shop, featured } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (shop) {
            query.shop = shop;
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const plants = await Plant.find(query).populate('shop', 'shopName email phone address image virtualTourPath');
        res.json(plants);
    } catch (err) {
        console.error('Fetch plants error:', err);
        res.status(500).json({ message: 'Server error fetching plants' });
    }
});

// Get Single Plant by ID
router.get('/:id', async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id).populate('shop', 'shopName email phone address image virtualTourPath');
        if (!plant) return res.status(404).json({ message: 'Plant not found' });
        res.json(plant);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching plant details' });
    }
});

// Create Plant (Shop authorization required)
router.post('/', auth('shop'), upload.single('image'), async (req, res) => {
    try {
        const { name, category, description, price, inStock, model3dHtml, model3dGlb, isFeatured, stockQuantity } = req.body;
        
        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            imageUrl = req.body.image;
        }

        if (!imageUrl) {
            return res.status(400).json({ message: 'Plant image is required' });
        }

        const plant = new Plant({
            name,
            category,
            description,
            price: Number(price),
            inStock: inStock !== undefined ? (inStock === 'true' || inStock === true) : true,
            image: imageUrl,
            model3dHtml: model3dHtml || '',
            model3dGlb: model3dGlb || '',
            shop: req.user.id,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            stockQuantity: Number(stockQuantity) || 10
        });

        await plant.save();
        res.status(201).json({ message: 'Plant created successfully', plant });
    } catch (err) {
        console.error('Create plant error:', err);
        res.status(500).json({ message: 'Error creating plant listing' });
    }
});

// Update Plant (Shop authorization required)
router.put('/:id', auth('shop'), upload.single('image'), async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) return res.status(404).json({ message: 'Plant not found' });

        if (plant.shop.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this plant' });
        }

        const { name, category, description, price, inStock, model3dHtml, model3dGlb, isFeatured, stockQuantity } = req.body;

        if (name) plant.name = name;
        if (category) plant.category = category;
        if (description) plant.description = description;
        if (price !== undefined) plant.price = Number(price);
        if (inStock !== undefined) plant.inStock = inStock === 'true' || inStock === true;
        if (model3dHtml !== undefined) plant.model3dHtml = model3dHtml;
        if (model3dGlb !== undefined) plant.model3dGlb = model3dGlb;
        if (isFeatured !== undefined) plant.isFeatured = isFeatured === 'true' || isFeatured === true;
        if (stockQuantity !== undefined) plant.stockQuantity = Number(stockQuantity);

        if (req.file) {
            plant.image = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            plant.image = req.body.image;
        }

        await plant.save();
        res.json({ message: 'Plant updated successfully', plant });
    } catch (err) {
        res.status(500).json({ message: 'Error updating plant listing' });
    }
});

// Delete Plant (Shop authorization required)
router.delete('/:id', auth('shop'), async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) return res.status(404).json({ message: 'Plant not found' });

        if (plant.shop.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this plant' });
        }

        await Plant.findByIdAndDelete(req.params.id);
        res.json({ message: 'Plant deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting plant listing' });
    }
});

module.exports = router;
