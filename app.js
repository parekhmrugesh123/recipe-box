const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const recipes = require('./routes/recipes');
const comments = require('./routes/comments');

// Connecting to the MongoDB database
mongoose.connect('mongodb://localhost:27017/recipe-box')
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.log(err);
    })

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/recipes', recipes);
app.use('/recipes/:id/comments', comments);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no! Something went wrong';
    res.status(statusCode).render('error', { err });
});

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log('Listening on port 3000');
});