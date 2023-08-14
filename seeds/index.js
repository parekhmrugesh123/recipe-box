const mongoose = require('mongoose');
const recipes = require('./recipeseeds');
const RecipeBox = require('../models/recipebox.js');

mongoose.connect('mongodb://localhost:27017/recipe-box')
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.log(err);
    })

const formatRecipeNameForUrl = (name) => {
    return encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));
};

const seedDB = async () => {
    try {
        await RecipeBox.deleteMany({});

        for (const recipeData of recipes) {
            const formattedName = formatRecipeNameForUrl(recipeData.name);
            const recipe = new RecipeBox({
                author: '64cc4cd803a095e4e5f11030',
                name: recipeData.name,
                summary: recipeData.summary,
                images: [
                    {
                        url: `https://source.unsplash.com/800x800/?${formattedName}`,
                    },
                ],
                cooktime: recipeData.cooktime,
                ingredients: recipeData.ingredients,
                directions: recipeData.directions,
            });
            await recipe.save();
        }
        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})