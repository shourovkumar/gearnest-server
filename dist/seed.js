"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// demo user + real equipment seed - live site er jonno
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const Equipment_1 = __importDefault(require("./models/Equipment"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
const run = async () => {
    await (0, db_1.default)();
    // ---------- USERS ----------
    const users = [
        { name: 'Admin', email: 'admin@gearnest.com', password: 'Admin123!', role: 'admin', photo: '' },
        { name: 'Owner', email: 'owner@gearnest.com', password: 'Owner123!', role: 'owner', photo: '' },
        {
            name: 'Customer',
            email: 'customer@gearnest.com',
            password: 'Customer123!',
            role: 'customer',
            photo: '',
        },
    ];
    for (const u of users) {
        const old = await User_1.default.findOne({ email: u.email });
        if (!old) {
            await new User_1.default(u).save();
            console.log('Created:', u.email);
        }
        else {
            console.log('Already exists:', u.email);
        }
    }
    // ---------- EQUIPMENTS - real image ----------
    const owner = await User_1.default.findOne({ email: 'owner@gearnest.com' });
    if (!owner) {
        console.log('Owner not found, seed stopped');
        process.exit(1);
    }
    const equipments = [
        {
            name: 'Canon EOS R50 Camera',
            description: 'Professional mirrorless camera for photo & video shoot. 4K video, fast autofocus, perfect for events, vlog and wedding shoot.',
            category: 'Camera',
            pricePerDay: 1200,
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
            location: 'Dhaka',
            availability: true,
        },
        {
            name: 'Sony A7 III Mirrorless Camera',
            description: 'Full-frame mirrorless camera with amazing low-light performance. Best for professional photography and filmmaking.',
            category: 'Camera',
            pricePerDay: 1800,
            image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
            location: 'Dhaka',
            availability: true,
        },
        {
            name: 'DJI Mini 4 Pro Drone',
            description: '4K drone with 34-min flight time, obstacle sensing and stunning aerial shots. Perfect for wedding, travel and event coverage.',
            category: 'Drone',
            pricePerDay: 2500,
            image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
            location: 'Dhaka',
            availability: true,
        },
        {
            name: 'GoPro Hero 12 Action Camera',
            description: 'Waterproof action camera for vlog, sports, biking and travel. HyperSmooth stabilization with 5.3K video.',
            category: 'Camera',
            pricePerDay: 800,
            image: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=800&q=80',
            location: 'Chattogram',
            availability: true,
        },
        {
            name: '50mm Prime Lens',
            description: 'Sharp f/1.8 prime lens for portrait and product photography. Beautiful background blur, low-light king.',
            category: 'Lens',
            pricePerDay: 600,
            image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80',
            location: 'Dhaka',
            availability: true,
        },
        {
            name: 'Manfrotto Tripod Stand',
            description: 'Heavy-duty professional tripod for camera and video. Stable, height adjustable, perfect for studio and outdoor shoot.',
            category: 'Accessories',
            pricePerDay: 300,
            image: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?auto=format&fit=crop&w=800&q=80',
            location: 'Dhaka',
            availability: true,
        },
        {
            name: 'LED Video Light Panel',
            description: 'Bi-color LED panel with dimmer and stand. Soft, bright light for YouTube, studio, interview and product shoot.',
            category: 'Lighting',
            pricePerDay: 500,
            image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
            location: 'Dhaka',
            availability: true,
        },
        {
            name: 'Studio Softbox Lighting Kit',
            description: '2x softbox lighting kit with stands and bulbs. Professional studio setup for portrait, fashion and e-commerce shoot.',
            category: 'Lighting',
            pricePerDay: 650,
            image: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&w=800&q=80',
            location: 'Dhaka',
            availability: true,
        },
        {
            name: 'Rode Wireless Go Mic',
            description: 'Wireless lavalier mic system for clear voice. Best for YouTube, interview, vlog, podcast and event coverage.',
            category: 'Audio',
            pricePerDay: 400,
            image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
            location: 'Dhaka',
            availability: true,
        },
        {
            name: 'JBL Party Speaker',
            description: 'Powerful portable Bluetooth speaker with deep bass and 12-hour battery. Perfect for party, event and outdoor program.',
            category: 'Audio',
            pricePerDay: 900,
            image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
            location: 'Dhaka',
            availability: true,
        },
        {
            name: 'DJI Ronin Gimbal Stabilizer',
            description: '3-axis gimbal for smooth cinematic video. No shake, professional camera movement for wedding and film shoot.',
            category: 'Accessories',
            pricePerDay: 700,
            image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
            location: 'Dhaka',
            availability: true,
        },
        {
            name: 'Epson Full HD Projector',
            description: 'Full HD projector with 3000 lumens brightness. Best for presentation, movie night, classroom and event screening.',
            category: 'Projector',
            pricePerDay: 1500,
            image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
            location: 'Chattogram',
            availability: true,
        },
    ];
    for (const e of equipments) {
        await Equipment_1.default.findOneAndUpdate({ name: e.name }, { ...e, owner: owner._id }, { upsert: true, new: true });
        console.log('Seeded:', e.name);
    }
    console.log('Seed done - users + equipments');
    process.exit(0);
};
run();
