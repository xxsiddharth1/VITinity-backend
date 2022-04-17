const mongoose = require('mongoose');


const AuthusersSchema = new mongoose.Schema(
    {
        registerId: {
            type: String,
            required: true,
            unique: true,
            max: 20
        },

        username: {
            type: String,
            required: true,
            max: 100
        }
    }
);

module.exports = mongoose.model('Authusers', AuthusersSchema);
