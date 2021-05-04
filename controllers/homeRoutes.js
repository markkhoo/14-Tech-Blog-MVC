const router = require('express').Router();
const { Post, User } = require('../models');
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



module.exports = router;
