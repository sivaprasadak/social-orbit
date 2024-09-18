const express = require("express");
const multer = require("multer");
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();
const authenticateToken = require('../middleware/check-auth');
const User = require('../models/user');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const Post = require("../models/post");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, callback) {
      const isvalid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error('Invalid mime type');
      if (isvalid) {
        error = null
      }
      callback(null, { fieldName: file.fieldname });
    },
    filename: (req, file, callback) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(null, name + '-' + Date.now() + "." + ext);
    }
  }),
})

const router = express.Router();

router.post("", authenticateToken, storage.single('image'), (req, res, next) => {
  const post = new Post({
    imagePath: req.file.location,
    creator: req.user.userId,
    type: req.body.type
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        id: createdPost._id,
        imagePath: createdPost.imagePath
      }
    });
  });
});

router.get("", authenticateToken, async (req, res, next) => {
  try {
    const currentUserId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
      return res.status(400).json({ message: 'Invalid page or limit' });
    }

    const totalPostsCount = await Post.countDocuments();

    let posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate('creator', 'fname lname');

    posts = posts.filter(post => {
      if (post.type === 'public') {
        return true;
      } else if (post.type === 'private') {
        return post.creator._id.toString() === currentUserId ||
          req.user.friends.some(friend => friend.userId === post.creator._id.toString());
      } else {
        return false;
      }
    });

    const totalPages = Math.ceil(totalPostsCount / pageSize);

    const isFirstPage = pageNumber === 1;
    const isLastPage = pageNumber >= totalPages;

    res.status(200).json({
      posts,
      totalPostsCount,
      totalPages,
      currentPage: pageNumber,
      isFirstPage,
      isLastPage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const currentUserId = req.user.userId;

    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isAdmin = user.role === 'admin';

    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!isAdmin && post.creator.toString() !== currentUserId) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    await Post.deleteOne({ _id: postId });

    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.postId;
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      text,
      creator: userId,
      createdAt: new Date()
    });

    await post.save();

    res.status(201).json({ message: 'Comment added successfully', comment: post.comments[post.comments.length - 1] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/posts/:postId/like', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
