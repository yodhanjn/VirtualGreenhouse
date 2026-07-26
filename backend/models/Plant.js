const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Indoor', 'Outdoor', 'Succulent', 'Herb', 'Flowering', 'Foliage', 'Indoor & Air-Purifying']
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    inStock: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        required: true
    },
    model3dHtml: {
        type: String,
        default: ''
    },
    model3dGlb: {
        type: String,
        default: ''
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    stockQuantity: {
        type: Number,
        default: 10,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Plant', plantSchema);
