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
                author: '64cc4bd5a27f562443809f32',
                name: recipeData.name,
                summary: recipeData.summary,
                images: [
                    {
                        url: 'https://res.cloudinary.com/dietyfhtf/image/upload/v1691303968/RecipeBox/gad5h7knaak0ldoqnbsi.jpg',
                        fileName: 'RecipeBox/gad5h7knaak0ldoqnbsi',
                    },
                    {
                        url: 'https://res.cloudinary.com/dietyfhtf/image/upload/v1691303968/RecipeBox/apqozktazgdsyl0eg7za.jpg',
                        fileName: 'RecipeBox/apqozktazgdsyl0eg7za',
                    }
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

//https://source.unsplash.com/800x800/?recipe
