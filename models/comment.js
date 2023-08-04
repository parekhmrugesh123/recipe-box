const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for the comments 
const commentSchema = new Schema({
    text: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
})

module.exports = mongoose.model('Comment', commentSchema);