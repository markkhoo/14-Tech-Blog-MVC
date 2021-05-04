const router = require('express').Router();
const { Comment, Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        // Get all Posts data
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        // Serialize data so the template can read it
        const posts = postData.map((arg) => arg.get({ plain: true }));

        // Pass serialized data for handlebar
        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in
        });

    } catch (err) {
        res.status(500).json(err);
    };
});

router.get('/login', async (req, res) => {
    try {
        // Catches incase user is logged in already
        if (req.session.login_in) {
            res.redirect('/'); // Remember to change this route
            return;
        };

        // Render login else
        res.render('login');
    } catch (err) {
        res.status(500).json(err);
    };
});

router.get('/dashboard', withAuth, async (req, res) => {
    try {
        //
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password', 'email'] },
            include: [{ model: Post }]
        });

        const user = userData.get({ plain: true });

        //
        res.render('dashboard', {
            user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    };
});

router.get('/post/:id', withAuth, async (req, res) => {
    try {
        //
        const postData = await Post.findByPk(req.params.id, {
            include: [{ model: Comment, include: [{ model: User }] }, { model: User }]
        });

        const post = postData.get({ plain: true });
console.log(post); console.log(post.comments[0].user.name);
        //
        res.render('detailedPost', {
            post,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    };
});

module.exports = router;
