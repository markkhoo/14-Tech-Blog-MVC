const router = require('express').Router();
const { User } = require('../../models');



router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });

        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', async (req, res) => {
    // try {
        if (req.session.logged_in) {
            req.session.destroy(() => {
                res.status(204).end();
            });
            res.redirect('/');

        } else {
            res.status(404).end();
        };
    // } catch (err) {
    //     res.status(500).json(err);
    // };
});

module.exports = router;