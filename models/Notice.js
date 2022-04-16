const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema(
     {
        creator: {
            type: String,
            required: true,
            max: 20
        },
        body: {
            type: String,
            required: true,
            max: 120,
        },
    },
    {timestamps: true} 
);

module.exports = mongoose.model('Notice', NoticeSchema);