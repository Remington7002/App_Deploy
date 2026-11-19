require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const accounts = [
  { name: 'Campus Super Admin', email: 'superadmin@campusconnect.local', role: 'super_admin', department: null },
  { name: 'Cafeteria Admin', email: 'cafeteria@campusconnect.local', role: 'department_admin', department: 'cafeteria' },
  { name: 'Library Admin', email: 'library@campusconnect.local', role: 'department_admin', department: 'library' },
  { name: 'IT Admin', email: 'it@campusconnect.local', role: 'department_admin', department: 'it' },
  { name: 'Academic Admin', email: 'academic@campusconnect.local', role: 'department_admin', department: 'academic' },
];

async function seed() {
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password || password.length < 10) throw new Error('Set SEED_ADMIN_PASSWORD (at least 10 characters) in backend/.env before seeding');
  await connectDB();
  const passwordHash = await bcrypt.hash(password, 10);
  for (const account of accounts) {
    const result = await User.updateOne({ email: account.email }, { $setOnInsert: { ...account, passwordHash } }, { upsert: true });
    console.log(`${result.upsertedCount ? 'Created' : 'Already exists'}: ${account.email}`);
  }
  console.log('Demo admin accounts ready. Password is your SEED_ADMIN_PASSWORD.');
}

seed().catch(error => { console.error('Seeding failed:', error.message); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
