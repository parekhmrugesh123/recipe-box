const RecipeBox = require('../models/recipebox');
const Comment = require('../models/comment');

module.exports.addComment = async (req, res) => {
    const recipe = await RecipeBox.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    recipe.comments.push(comment);
    await comment.save();
    await recipe.save();
    req.flash('success', 'Comment posted!');
    res.redirect(`/recipes/${recipe._id}`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await RecipeBox.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment deleted!');
    res.redirect(`/recipes/${id}`);
}