//create web server
const express = require('express');
const router = express.Router();

//import comment model
const Comment = require('../models/Comment');

//import article model
const Article = require('../models/Article');

//import user model
const User = require('../models/User');

//import auth middleware
const { ensureAuthenticated } = require('../config/auth');

//import flash
const flash = require('connect-flash');

//import moment
const moment = require('moment');

//create comment
router.post('/create', ensureAuthenticated, (req, res) => {
    const { comment } = req.body;
    const articleId = req.body.articleId;
    const userId = req.user._id;
    const newComment = new Comment({
        comment,
        articleId,
        userId
    });
    newComment.save()
        .then(comment => {
            req.flash('success_msg', 'Comment created successfully');
            res.redirect(`/articles/${articleId}`);
        })
        .catch(err => {
            req.flash('error_msg', 'Something went wrong');
            res.redirect(`/articles/${articleId}`);
        });
});

//edit comment
router.put('/edit/:id', ensureAuthenticated, (req, res) => {
    const commentId = req.params.id;
    const { comment } = req.body;
    Comment.findByIdAndUpdate(commentId, { comment }, { new: true })
        .then(comment => {
            req.flash('success_msg', 'Comment updated successfully');
            res.redirect(`/articles/${comment.articleId}`);
        })
        .catch(err => {
            req.flash('error_msg', 'Something went wrong');
            res.redirect(`/articles/${comment.articleId}`);
        });
});

//delete comment
router.delete('/delete/:id', ensureAuthenticated, (req, res) => {
    const commentId = req.params.id;
    Comment.findByIdAndDelete(commentId)
        .then(comment => {
            req.flash('success_msg', 'Comment deleted successfully');
            res.redirect(`/articles/${comment.articleId}`);
        })
        .catch(err => {
            req.flash('error_msg', 'Something went wrong');
            res.redirect(`/articles/${comment.articleId}`);
        });
});

module.exports = router;