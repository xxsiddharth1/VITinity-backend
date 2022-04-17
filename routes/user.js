const userRouter = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
const JWT = require('jsonwebtoken');
const Post = require('../models/Post');
const config = require('../passport');
const Authusers = require('../models/Authusers');

const signToken = userId => {
    return JWT.sign({
        iss: "IshaanPare",
        sub: userId
    },"IshaanPare",{expiresIn: "1h"});
}

userRouter.post('/register', (req,res)=>{
    const {regId, username, password} = req.body;

    User.findOne({regId}, (err,user)=>{
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Error has occured"
                },
                msgError: true
            });
        if (user)
            res.status(400).json({
                message: {
                    msgBody: "Already have an account"
                },
                msgError: true
            });
        else {
            const newUser = new User({regId,username,password});
            newUser.save(err=>{
                if (err)
                    res.status(500).json({
                        message: {
                            msgBody: "Error has occured"
                        },
                        msgError: true
                    });
                else
                    res.status(201).json({
                        message: {
                            msgBody: "Account created succesfully"
                        },
                        msgError: false
                    });
            })
        }
    })

});

userRouter.post('/login', passport.authenticate('local', {session: false}), (req,res)=>{
    if (req.isAuthenticated()){
        const {_id, username, regId} = req.user;
        const token = signToken(_id);
        console.log(token);
        res.cookie('access_token', token, {httpOnly: false, sameSite: true});
        res.status(200).json({isAuthenticated: true, user: {username, regId}});
    }
});

userRouter.get('/logout', passport.authenticate('jwt', {session: false}), (req, res)=>{
    res.clearCookie('access_token');
    res.json({user: {username: "", userId: ""}, success: true});
});

userRouter.get('/authenticated',passport.authenticate('jwt',{session: false}),(req,res)=>{
    const {_id,username,regId,isAdmin} = req.user;
    res.status(200).json({isAuthenticated: true,user: {_id,username,regId,isAdmin}});//does putting here id usefull
});

userRouter.get('/admins', passport.authenticate('jwt', {session: false}), (req,res)=>{
    User.find({isAdmin: true}, {regId:1})
        .then(data=>{
            res.status(200).json(data);
        })
})

//aggregate function for user
userRouter.get("/numuser", passport.authenticate('jwt', {session: false}), (req, res)=>{
    User.countDocuments({}).then(data=>{
        res.status(200).json({"count":data});
    });
});


//add user into db entries (authorizing of users);
userRouter.post('/newuser', passport.authenticate('jwt', {session: false}), (req,res)=>{
    const newUser = new Authusers({registerId: req.body.registerId, username: req.body.username});

    if (req.user["isAdmin"]) {
        newUser.save(err=>{
            if (err) 
                res.status(500).json({
                    message: {
                        msgBody: "error has occered while saving doc",
                        msgError: true
                    }
                })
            
            else
                res.status(200).json({
                    message: {
                        msgBody: "Successfully added new user to list",
                        msgError: false
                    }
                })
            }
        )
    }
    else{
        res.status(401).json({
            message: {
                msgBody: "Not a right person",
                msgError: true
            }
        })
    }
});

userRouter.get('/allauthusers', passport.authenticate('jwt', {session: false}), (req,res)=>{

    if (req.user["isAdmin"])
        Authusers.find({})
            .then((data)=>{
                res.status(200).json(data);

            })

    else
            res.status(401).json({
                message: {
                    msgBody: "Not a right person",
                    msgError: true
                }
            })
})

module.exports = userRouter;