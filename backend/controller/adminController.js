const Review = require('../models/reviews.js');
const User = require('../models/user.js')
const { Op } = require('sequelize');


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: { [Op.not]: 'admin' },
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.verifyUser = async (req, res) => {
  const { id } = req.params;

  try {
    const tutor = await User.findByPk(id);
    if (!tutor) return res.status(404).json({ message: 'User not found' });

    tutor.isVerified = true;
    await tutor.save();

    res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.createUser = async (req, res) => {
  const { name, email, password, role, phoneNumber} = req.body;

  try {
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      phoneNumber
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

 
                         //Reviews Portionss




exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          as: 'parent',  
          attributes: ['name', 'profilePicture'],  
        },
      ],
    });

    if (!reviews) {
      return res.status(404).json({ message: 'No reviews found' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id, {
      include: [
        {
          model: User,
          as: 'parent',
          attributes: ['name', 'profilePicture'],
        }
      ]
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

   
    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};


exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.destroy();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.createReview = async (req, res) => {
  const { tutor_id, parent_id, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const newReview = await Review.create({
      tutor_id,
      parent_id,
      rating,
      comment
    });

    res.status(201).json({ message: 'Review created successfully', review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};






