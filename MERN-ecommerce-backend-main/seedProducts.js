const mongoose = require('mongoose');
const  Product = require('./model/Product');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/ecommerce';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    const dataPath = path.join(__dirname, 'data.json');
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    const { products } = JSON.parse(jsonData);

    if (!products || products.length === 0) {
      console.error('⚠️ No products found in data.json');
      process.exit(1);
    }
    products.forEach(product => {
  if (!product.brand) {
    product.brand = "Unknown Brand"; // Or any default value you prefer
  }
  products.forEach((p) => {
  console.log(p.title, '=>', p.price);
});

});

    // Optional: Clear old data
    await Product.deleteMany({});
    console.log('🧹 Old products removed');

    // Insert new data
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products inserted successfully`);

    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
