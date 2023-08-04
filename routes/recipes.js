const express = require('express');
const router = express.Router();
const recipes = require('../controllers/recipes');
const catchAsync = require('../utils/catchAsync');
const { validateRecipe, isLoggedIn, isAuthor } = require('../middleware');

router.route('/')
    .get(catchAsync(recipes.index))
    .post(isLoggedIn, validateRecipe, catchAsync(recipes.createRecipe));

router.get('/new', isLoggedIn, recipes.newForm);

router.route('/:id')
    .get(catchAsync(recipes.showRecipe))
    .put(isLoggedIn, isAuthor, validateRecipe, catchAsync(recipes.updateRecipe))
    .delete(isLoggedIn, isAuthor, catchAsync(recipes.deleteRecipe));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(recipes.editForm));

module.exports = router;