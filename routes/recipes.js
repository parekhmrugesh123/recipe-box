const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const RecipeBox = require('../models/recipebox');
const { validateRecipe, isLoggedIn, isAuthor } = require('../middleware');

router.get('/', catchAsync(async (req, res) => {
    const recipes = await RecipeBox.find({});
    res.render('recipes/index', { recipes });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('recipes/new');
});

router.post('/', isLoggedIn, validateRecipe, catchAsync(async (req, res) => {
    const recipe = new RecipeBox(req.body.recipe);
    recipe.author = req.user._id;
    await recipe.save();
    req.flash('success', 'Successfully created new recipe!');
    res.redirect(`/recipes/${recipe.id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const recipe = await RecipeBox.findById(req.params.id)
        .populate({
            path: 'comments',
            populate: {
                path: 'author'
            }
        }).populate('author');
    if (!recipe) {
        req.flash('error', 'Recipe not found!');
        return res.redirect('/recipes');
    }
    res.render('recipes/show', { recipe });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const recipe = await RecipeBox.findById(req.params.id);
    if (!recipe) {
        req.flash('error', 'Recipe not found!');
        return res.redirect('/recipes');
    }
    res.render('recipes/edit', { recipe });
}));

router.put('/:id', isLoggedIn, isAuthor, validateRecipe, catchAsync(async (req, res) => {
    const { id } = req.params;
    const recipe = await RecipeBox.findByIdAndUpdate(id, { ...req.body.recipe });
    req.flash('success', 'Successfully updated recipe!');
    res.redirect(`/recipes/${recipe._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await RecipeBox.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted recipe!');
    res.redirect('/recipes');
}));

module.exports = router;