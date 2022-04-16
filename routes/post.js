const postRouter = require('express').Router();
const Post = require('../models/Post');
const config = require('../passport');
const passport = require('passport');
const User = require('../models/User');
const Notice = require('../models/Notice');


postRouter.post('/upload', passport.authenticate('jwt', { session: false }), (req, res) => {
    const post = new Post({ creator: req.body.creator, registerId: req.body.registerId, body: req.body.body });
    post.save(err => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Error has occured"
                },
                msgError: true
            });
        else {
            req.user.posts.push(post);
            req.user.save(err => {
                if (err)
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

postRouter.get('/getall', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.find({ category: "Database" })
        .then(data => {
            res.status(200).json(data);
        });
})

postRouter.delete('/:id', passport.authenticate('jwt', { session: false }),(req, res) => {

    const {posts} = req.user;
    if (posts.indexOf(req.params.id) !== -1) {
        Post.findByIdAndDelete(req.params.id)
            .then(data => {
                if (!data)
                    res.status(500).json({
                        message: {
                            msgBody: "Error has occured",
                            msgError: true
                        }
                    })
                else {
                    res.status(200).json({
                        message: {
                            msgBody: "Successfully deleted",
                            msgError: false
                        }
                    })
                }
            })
            .then(async ()=>{
                let newPost = req.user["posts"];
                console.log(newPost);
                newPost.splice(newPost.indexOf(req.params.id), 1);
                console.log(newPost);
                await User.findByIdAndUpdate(req.user["id"], {posts: newPost});
            });
    }
    else {
        res.status(200).json({
            message: {
                msgBody: "Not allow to delete another person post",
                msgError: true
            }
        })
    }



});

postRouter.put('/upvote/:id', passport.authenticate('jwt', {session: false}), (req,res)=>{
    //todo we will be handle the multiple likes by one person in frontend for sake of time
    Post.findByIdAndUpdate(req.params.id, {$inc: { likes: 1 }, $push: {voted: req.user["id"]}}, (err)=>{
        if (err)
            res.status(500).json({
                message: "Error occured",
                msgError: true
            })
        else 
            res.status(200).json({
                message: "Upvote",
                msgError: false
            })
    })
});


postRouter.put('/downvote/:id', passport.authenticate('jwt', {session: false}), (req,res)=>{
    //todo we will be handle the multiple likes by one person in frontend for sake of time
    Post.findByIdAndUpdate(req.params.id, {$inc: { likes: -1 }, $push: {voted: req.user["id"]}}, (err)=>{
        if (err)
            res.status(500).json({
                message: "Error occured",
                msgError: true
            })
        else 
            res.status(200).json({
                message: "Downvote",
                msgError: false
            })
    })
});


//notice routes 


postRouter.post('/notice', passport.authenticate('jwt', { session: false }), (req, res) => {
    const notice = new Notice({ creator: req.body.creator, body: req.body.body });
    notice.save(err => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Error has occured"
                },
                msgError: true
            });
        else {
            res.status(200).json({
                message: {
                    msgBody: "Succesfully created a post",
                    msgError: false
                }
            });
    
        }
    });
});


postRouter.get('/getallnotices', passport.authenticate('jwt', { session: false }), (req, res) => {
    Notice.find({ category: "Database" })
        .then(data => {
            res.status(200).json(data);
        });
})


module.exports = postRouter;