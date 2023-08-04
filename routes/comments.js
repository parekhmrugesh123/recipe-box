const express = require('express');
const router = express.Router({ mergeParams: true });
const comments = require('../controllers/comments');
const catchAsync = require('../utils/catchAsync');
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateComment, catchAsync(comments.addComment));

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment))

module.exports = router;