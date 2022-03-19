const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        password:{
            type: String,
            required: true,
            min: 6
        },
        isAdmin:{
            type: Boolean,
            default: false
        },
        regId:{
            type: String,
            required: true,
            unique: true
        },
        posts:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }]
    }
);

UserSchema.pre('save',function(nxt){
    if (!this.isModified('password'))
        return nxt();

    bcrypt.hash(this.password, 10, (err,passwordHash)=>{
        if (err)
            return nxt(err);
        this.password = passwordHash;
        nxt();
    });
});

UserSchema.methods.comparePassword = function(password,cb){
    bcrypt.compare(password,this.password,(err,isMatch)=>{
        if(err)
            return cb(err);

        else
            if(!isMatch)
                return cb(null,isMatch);
            return cb(null,this);
    });
}


module.exports = mongoose.model('User',UserSchema);