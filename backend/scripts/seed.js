const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Shop = require('../models/Shop');
const Plant = require('../models/Plant');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual-greenhouse-saas';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        await Shop.deleteMany({});
        await Plant.deleteMany({});
        await User.deleteMany({});

        const plainPassword = 'password123';

        // Seed Users
        const demoUser = await User.create({
            name: 'Jane Gardener',
            email: 'user@example.com',
            password: plainPassword,
            phone: '+91 98765 43210',
            address: '42 Blossom Avenue, Green Park, Chennai, Tamil Nadu 600020'
        });

        // Seed Shops
        const shop1 = await Shop.create({
            shopName: 'Nandanam Nursery',
            email: 'nandanam@example.com',
            password: plainPassword,
            phone: '+91 44 2434 4455',
            address: 'No. 12, Venkatesa Agraharam, Mylapore, Chennai, Tamil Nadu 600004',
            description: 'One of the oldest and most trusted organic nurseries in Chennai. Specializing in tropical house plants, indoor foliage, and exotic flowering plants.',
            image: '/assets/GreenThumbaGarden.jpg',
            virtualTourPath: '/Virtual/Nandanam_Nursery/app-files/index.html'
        });

        const shop2 = await Shop.create({
            shopName: 'The Nurserymen Co-operative Society Ltd',
            email: 'nurserymen@example.com',
            password: plainPassword,
            phone: '+91 44 2819 0417',
            address: 'No. 1, 3rd Main Road, CIT Colony, Mylapore, Chennai, Tamil Nadu 600004',
            description: 'A prestigious cooperative society of master nurserymen providing high-quality indoor plants, drought-tolerant succulents, and gardening tools.',
            image: '/assets/shop_register.png',
            virtualTourPath: '/Virtual/The_Nurserymen_Cooperative_Society_Ltd/app-files/index.html'
        });

        // Seed Plants with 3D models and distinct species images
        const plantsData = [
            // Plants for Nandanam Nursery
            {
                name: 'Croton Variegatum',
                category: 'Foliage',
                description: 'Vibrant indoor plant with striking multi-colored leaves. Brings immediate warmth and elegance to modern spaces.',
                price: 1299,
                inStock: true,
                stockQuantity: 15,
                image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
                model3dHtml: '/Plant3D/croton.html',
                model3dGlb: '/Plant3D/croton_plant.glb',
                isFeatured: true,
                shop: shop1._id
            },
            {
                name: 'Golden Pothos',
                category: 'Indoor & Air-Purifying',
                description: 'Fast-growing trailing vine with heart-shaped golden variegated leaves. Exceptionally easy to care for.',
                price: 799,
                inStock: true,
                stockQuantity: 20,
                image: 'https://images.unsplash.com/photo-1597055181300-e3633a207519?auto=format&fit=crop&w=800&q=80',
                model3dHtml: '/Plant3D/golden_pothos.html',
                model3dGlb: '/Plant3D/golden_pothos.glb',
                isFeatured: true,
                shop: shop1._id
            },
            {
                name: 'Hibiscus Rosa-Sinensis',
                category: 'Flowering',
                description: 'Classic tropical flowering shrub with vivid scarlet red blossoms that bloom continuously in bright light.',
                price: 999,
                inStock: true,
                stockQuantity: 12,
                image: 'https://images.unsplash.com/photo-1551893478-d726eaf0442c?auto=format&fit=crop&w=800&q=80',
                model3dHtml: '/Plant3D/hibiscus.html',
                model3dGlb: '/Plant3D/hibiscus.glb',
                isFeatured: false,
                shop: shop1._id
            },
            {
                name: 'Peace Lily',
                category: 'Indoor & Air-Purifying',
                description: 'Elegant white flowering plant renowned for purifying indoor air toxins and creating peaceful ambiences.',
                price: 699,
                inStock: true,
                stockQuantity: 18,
                image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
                model3dHtml: '',
                model3dGlb: '',
                isFeatured: true,
                shop: shop1._id
            },
            {
                name: 'Rubber Plant (Ficus Elastica)',
                category: 'Indoor',
                description: 'Hardy rubber tree with bold, glossy dark leaves. Adds structural beauty to home interiors.',
                price: 1499,
                inStock: true,
                stockQuantity: 8,
                image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
                model3dHtml: '/Plant3D/rubber.html',
                model3dGlb: '/Plant3D/rubber_plant.glb',
                isFeatured: true,
                shop: shop1._id
            },

            // Plants for The Nurserymen Co-operative Society
            {
                name: 'Rose Bush Bloom',
                category: 'Flowering',
                description: 'Fragrant perennial rose bush with lush layered petals. Ideal for patio gardens and outdoor planters.',
                price: 899,
                inStock: true,
                stockQuantity: 25,
                image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
                model3dHtml: '/Plant3D/rose.html',
                model3dGlb: '/Plant3D/rose_bush.glb',
                isFeatured: true,
                shop: shop2._id
            },
            {
                name: 'ZZ Plant (Zamioculcas)',
                category: 'Indoor',
                description: 'Virtually indestructible indoor plant featuring waxy, emerald leaves. Thrives even in low-light environments.',
                price: 1099,
                inStock: true,
                stockQuantity: 14,
                image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=800&q=80',
                model3dHtml: '',
                model3dGlb: '',
                isFeatured: true,
                shop: shop2._id
            },
            {
                name: 'Aloe Vera Medicinal',
                category: 'Succulent',
                description: 'Famous soothing succulent with thick fleshy leaves filled with natural aloe gel.',
                price: 499,
                inStock: true,
                stockQuantity: 30,
                image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80',
                model3dHtml: '',
                model3dGlb: '',
                isFeatured: false,
                shop: shop2._id
            },
            {
                name: 'Jade Plant (Crassula Ovata)',
                category: 'Succulent',
                description: 'Traditional good luck money plant with thick woody stems and glossy jade-green leaves.',
                price: 699,
                inStock: true,
                stockQuantity: 16,
                image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80',
                model3dHtml: '',
                model3dGlb: '',
                isFeatured: false,
                shop: shop2._id
            }
        ];

        await Plant.insertMany(plantsData);

        console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
        console.log('Demo User: user@example.com / password123');
        console.log('Shop 1: nandanam@example.com / password123');
        console.log('Shop 2: nurserymen@example.com / password123');

        await mongoose.disconnect();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();
