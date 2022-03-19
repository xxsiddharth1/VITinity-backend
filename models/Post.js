const mongoose = require('mongoose');

//todo
//add comments in post

const PostSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true,
            max: 120,
        },
        likes: {
            type: Number,
            default: 0
        },
    }
);

module.exports = mongoose.model('Post',PostSchema);