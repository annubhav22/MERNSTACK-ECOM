const Product = require('../model/Product');
console.log('✅ Model loaded:', Product);
// ---------- Create New Product ----------
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);

    // Calculate discount price
    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('❌ Error in createProduct:', err.message);
    res.status(400).json({ error: 'Failed to create product', details: err });
  }
};

// ---------- Fetch All Products ----------
exports.fetchAllProducts = async (req, res) => {
  let condition = {};

  // Hide soft-deleted products from users
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalQuery = Product.find(condition);

  // Filter by category
  if (req.query.category) {
    const categories = req.query.category.split(',');
    query = query.find({ category: { $in: categories } });
    totalQuery = totalQuery.find({ category: { $in: categories } });
  }

  // Filter by brand
if (req.query.brand) {
  const brands = req.query.brand.split(',').map(b => new RegExp(`^${b}$`, 'i'));
  query = query.find({ brand: { $in: brands } });
}

  // Sort
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  // Pagination
  const totalDocs = await totalQuery.count().exec();
  if (req.query._page && req.query._limit) {
    const page = parseInt(req.query._page);
    const limit = parseInt(req.query._limit);
    const skip = limit * (page - 1);
    query = query.skip(skip).limit(limit);
  }

  try {
    const products = await query.exec();
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(products);
  } catch (err) {
    console.error('❌ Error in fetchAllProducts:', err.message);
    res.status(400).json({ error: 'Failed to fetch products', details: err });
  }
};

// Export under an additional name expected by the route
exports.fetchProductsByFilters = exports.fetchAllProducts;

// ---------- Fetch Product by ID ----------
exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.thumbnail = `http://localhost:5000/uploads/${product.thumbnail}`;
    product.images = product.images.map(
      (img) => `http://localhost:5000/uploads/${img}`
    );

    res.status(200).json(product);
  } catch (err) {
    console.error('❌ Error in fetchProductById:', err.message);
    res.status(400).json({ error: 'Invalid product ID' });
  }
};

// ---------- Update Product ----------
exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let product = await Product.findByIdAndUpdate(id, req.body, { new: true });

    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('❌ Error in updateProduct:', err.message);
    res.status(400).json({ error: 'Failed to update product', details: err });
  }
};

// ---------- Soft Delete Product ----------
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );
    res.status(200).json({ success: true, product });
  } catch (err) {
    console.error('❌ Error in deleteProduct:', err.message);
    res.status(400).json({ error: 'Failed to delete product', details: err });
  }
};
