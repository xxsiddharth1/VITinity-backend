const postRouter = require('express').Router();
const Post = require('../models/Post');
const config = require('../passport');
const passport = require('passport');
const User = require('../models/User');


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


module.exports = postRouter;