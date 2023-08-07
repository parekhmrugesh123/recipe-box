const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

// Schema for the RecipeBox collection
const ImageSchema = new Schema({
    url: String,
    fileName: String,
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const RecipeBoxSchema = new Schema({
    name: String,
    summary: String,
    images: [ImageSchema],
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
