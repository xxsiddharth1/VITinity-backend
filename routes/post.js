const postRouter = require('express').Router();
const Post = require('../models/Post');
const config = require('../passport');
const passport = require('passport');


postRouter.post('/upload', passport.authenticate('jwt', {session: false}), (req,res)=>{
    const post = new Post({creator: req.body.creator, registerId: req.body.registerId, body: req.body.body});
    post.save(err=>{
        if(err)
            res.status(500).json({
                message: {
                    msgBody: "Error has occured"
                },
                msgError: true
            });
        else {
            req.user.posts.push(post);
            req.user.save(err=>{
                if(err)
                    res.status(500).json({
                        message: {
                            msgBody: "Error has occured",
                            msgError: false
                        }
                    });
                else
                    res.status(200).json({
                        message: {
                            msgBody: "Succesfully created a post",
                            msgError: false
                        }
                    });
            })
        }
    });
});

postRouter.get('/getall', passport.authenticate('jwt', {session: false}), (req,res)=>{
    Post.find({category: "Database"})
        .then(data=>{
            res.status(200).json(data);
        });
})
module.exports = postRouter;