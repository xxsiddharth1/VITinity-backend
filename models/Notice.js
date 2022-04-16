const mongoose = require('mongoose');



const NoticeSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true,
            max: 120,
        }
    },
    {timestamps: true}  
);

module.exports = mongoose.model('Notice',NoticeSchema);