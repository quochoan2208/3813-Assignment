const mongoose = require('mongoose');
const User = require('../datauser'); // Import model


module.exports = function (app, path, fs) {
    // Route to manage user logins

    app.post('/api/auth', async function (req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }

        try {
            const user = await User.findOne({ email: req.body.email, pwd: req.body.upwd });

            if (user) {
                // found user in MongoDB, send user information to client
                const customer = {
                    valid: true,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    id: user.id,
                };
                res.send(customer);
            } else {
                // not found user  , send back to client
                const customer = {
                    valid: false,
                    email: '',
                    username: '',
                    role: '',
                    id: 0,
                };
                res.send(customer);
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    });
};
