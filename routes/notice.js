const noticeRouter = require('express').Router();
const Notice = require('../models/Notice');
const config = require('../passport');
const passport = require('passport');

noticeRouter.post('/upload', passport.authenticate('jwt', {session: false}, (req,res)=>{
    const notice = new Notice({body: req.body});

    res.status(200).json({message: req});
    if (req.user["isAdmin"]) {
        // notice.save(err=>{
        //     if (err)
        //         res.status(500).json({
        //             message: {
        //                 msgBody: "Error has occured"
        //             },
        //             msgError: true
        //         })
        //     else 
        //         res.status(200).json({
        //             message: {
        //                 msgBody:"Successfully added notice"
        //             },
        //             msgError: false
        //         })
        // })
        res.status(200).json({
            message: {
                msgBody: "Yes"
            },
            msgError: false
        })
    }
    else {
        res.status(401).json({
            message: {
                msgBody: "You are not the right person"
            },
            msgError: true
        })
    }
    
}));


module.exports = noticeRouter;