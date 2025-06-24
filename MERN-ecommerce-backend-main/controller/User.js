const { User } = require('../model/User');

/**
 * GET /user/me
 * Fetch the currently authenticated user.
 */
exports.fetchUserById = async (req, res) => {
  const { id } = req.user; // Provided by authentication middleware

  try {
    const user = await User.findById(id).select('id addresses email role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

/**
 * PUT /user/:id
 * Update user data by user ID.
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).select('-password -salt');

    if (!user) {
      return res.status(404).json({ message: 'User not found for update' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
};