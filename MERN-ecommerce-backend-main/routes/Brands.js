const express = require('express');
const router = express.Router();
const Brand = require('../model/Brand');

router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.status(200).json(brands);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

module.exports = router;
