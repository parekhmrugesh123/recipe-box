const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

// Schema for the RecipeBox collection
const RecipeBoxSchema = new Schema({
    name: String,
    summary: String,
    image: String,
    cooktime: Number,
    ingredients: String,
    directions: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ]
});

RecipeBoxSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments,
            }
        })
    }
});

module.exports = mongoose.model('RecipeBox', RecipeBoxSchema);
