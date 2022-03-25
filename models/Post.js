const mongoose = require('mongoose');

//todo
//add comments in post

const PostSchema = new mongoose.Schema(
    {
        creator: {
            type: String,
            required: true,
            max: 20
        },
        registerId: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
            max: 120,
        },
        likes: {
            type: Number,
            default: 0
        },
    },
    {timestamps: true}
    
);

module.exports = mongoose.model('Post',PostSchema);