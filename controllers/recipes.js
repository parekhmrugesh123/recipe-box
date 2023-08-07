const RecipeBox = require('../models/recipebox');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const recipes = await RecipeBox.find({});
    res.render('recipes/index', { recipes });
}

module.exports.newForm = (req, res) => {
    res.render('recipes/new');
}

module.exports.createRecipe = async (req, res) => {
    const recipe = new RecipeBox(req.body.recipe);
    recipe.images = req.files.map(f => ({ url: f.path, fileName: f.filename }));
    recipe.author = req.user._id;
    await recipe.save();
    req.flash('success', 'Successfully created new recipe!');
    res.redirect(`/recipes/${recipe.id}`);
}

module.exports.showRecipe = async (req, res) => {
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
}

module.exports.editForm = async (req, res) => {
    const recipe = await RecipeBox.findById(req.params.id);
    if (!recipe) {
        req.flash('error', 'Recipe not found!');
        return res.redirect('/recipes');
    }
    res.render('recipes/edit', { recipe });
}

module.exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    const recipe = await RecipeBox.findByIdAndUpdate(id, { ...req.body.recipe });
    const imgs = req.files.map(f => ({ url: f.path, fileName: f.filename }));
    recipe.images.push(...imgs);
    await recipe.save();
    if (req.body.deleteImages) {
        for (let fName of req.body.deleteImages) {
            await cloudinary.uploader.destroy(fName);
        }
        await recipe.updateOne({ $pull: { images: { fileName: { $in: req.body.deleteImages } } } });
    };
    req.flash('success', 'Successfully updated recipe!');
    res.redirect(`/recipes/${recipe._id}`);
}

module.exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;
    await RecipeBox.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted recipe!');
    res.redirect('/recipes');
}