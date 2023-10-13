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
                // Tìm thấy người dùng trong MongoDB, gửi thông tin người dùng về phía client
                const customer = {
                    valid: true,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    id: user.id,
                };
                res.send(customer);
            } else {
                // Không tìm thấy người dùng, gửi thông báo về phía client
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
