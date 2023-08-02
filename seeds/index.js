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

const seedDB = async () => {
    try {
        await RecipeBox.deleteMany({});

        for (const recipeData of recipes) {
            const recipe = new RecipeBox({
                name: recipeData.name,
                summary: recipeData.summary,
                image: `https://source.unsplash.com/400x300/?${recipeData.name}`,
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

//https://source.unsplash.com/800x800/?recipe