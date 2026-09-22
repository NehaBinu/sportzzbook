const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Get all posts (most recent first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name sport city').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create a post
router.post('/', async (req, res) => {
  try {
    const { author, text, media } = req.body;
    const post = await Post.create({ author, text, media });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Like a post
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;