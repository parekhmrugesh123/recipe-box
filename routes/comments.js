const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const RecipeBox = require('../models/recipebox');
const Comment = require('../models/comment');
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateComment, catchAsync(async (req, res) => {
    const recipe = await RecipeBox.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    recipe.comments.push(comment);
    await comment.save();
    await recipe.save();
    req.flash('success', 'Comment posted!');
    res.redirect(`/recipes/${recipe._id}`);
}));

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await RecipeBox.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment deleted!');
    res.redirect(`/recipes/${id}`);
}))

module.exports = router;