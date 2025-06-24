const mongoose = require('mongoose');
const Brand = require('./model/Brand.js');       // Ensure these paths match your project structure
const Category = require('./model/Category');


const brands = [
  { label: 'Essence', value: 'Essence' },
  { label: 'Apple', value: 'apple' },
  { label: 'HP', value: 'hp' },
  { label: 'Sony', value: 'sony' },
  { label: 'LG', value: 'lg' },
  { label: 'Panasonic', value: 'panasonic' },
  { label: 'Puma', value: 'puma' },
  { label: 'Nike', value: 'nike' },
  { label: 'Adidas', value: 'adidas' },
  { label: 'Zara', value: 'zara' },
];

const categories = [
  { label: 'Groceries', value: 'groceries' },
  { label: 'Pet Supplies', value: 'pet-supplies' },
  { label: 'Meat', value: 'meat' },
  { label: 'Cooking Essentials', value: 'cooking-essentials' },
  { label: 'Vegetables', value: 'vegetables' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Seafood', value: 'seafood' },
  { label: 'Condiments', value: 'condiments' },
  { label: 'Desserts', value: 'desserts' },
  { label: 'Beverages', value: 'beverages' },
  { label: 'Fruits', value: 'fruits' },
];

async function seed() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log('✅ Connected to MongoDB');

    await Brand.deleteMany({});
    await Brand.insertMany(brands);
    console.log('✅ Brands seeded');

    await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log('✅ Categories seeded');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();