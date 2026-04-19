require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

const testUsers = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        // In local development, we use a default. In production, these wouldn't be in a seed file.
        password: process.env.SEED_ADMIN_PASSWORD || 'Admin@1234',
        role: 'admin',
    },
    {
        name: 'John Doe',
        email: 'user@example.com',
        password: process.env.SEED_USER_PASSWORD || 'User@1234',
        role: 'user',
    },
    {
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        password: process.env.SEED_USER_PASSWORD || 'Sarah@1234',
        role: 'user',
    },
];

const seed = async () => {
    try {
        await connectDB();
        console.log('🌱 Seeding test users...\n');

        for (const u of testUsers) {
            const exists = await User.findOne({ email: u.email });
            if (exists) {
                console.log(`⚠️  Skipped (already exists): ${u.email}`);
                continue;
            }
            const hashed = await bcrypt.hash(u.password, 10);
            await User.create({ ...u, password: hashed });
            console.log(`✅ Created [${u.role}]: ${u.email}`);
        }

        console.log('\n✅ Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
};

seed();
