const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { RecipeBoxSchema } = require('../schemas');
const RecipeBox = require('../models/recipebox');

const validateRecipe = (req, res, next) => {
    const { error } = RecipeBoxSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get('/', catchAsync(async (req, res) => {
    const recipes = await RecipeBox.find({});
    res.render('recipes/index', { recipes });
}));

router.get('/new', (req, res) => {
    res.render('recipes/new');
});

router.post('/', validateRecipe, catchAsync(async (req, res) => {
    const recipe = new RecipeBox(req.body.recipe);
    await recipe.save();
    res.redirect(`/recipes/${recipe.id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const recipe = await RecipeBox.findById(req.params.id).populate('comments');
    res.render('recipes/show', { recipe });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const recipe = await RecipeBox.findById(req.params.id);
    res.render('recipes/edit', { recipe });
}));

router.put('/:id', validateRecipe, catchAsync(async (req, res) => {
    const { id } = req.params;
    const recipe = await RecipeBox.findByIdAndUpdate(id, { ...req.body.recipe });
    res.redirect(`/recipes/${recipe._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await RecipeBox.findByIdAndDelete(id);
    res.redirect('/recipes');
}));

module.exports = router;