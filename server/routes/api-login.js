// module.exports = function (app,path,fs) {
//     //Route to manage user logins


//     app.post('/api/auth', function (req, res) {
//         if (!req.body) {
//             return res.sendStatus(400)
//         }
//         fs.readFile('data/users.json','utf8',(err,data)=>{
//             if (err) {
//               console.error(err)
//               return
//             }
//             try{
//                 console.log(data);
//               let users = JSON.parse(data);
//               users = users.people;
//               console.log(users);
//             var customer = {};
    
//             customer.valid = false;
//             customer.email = '';
//             customer.username = '';
//             customer.role = '';
    
//             for (let i = 0; i < users.length; i++) {
//                 if (req.body.email == users[i].email && req.body.upwd == users[i].pwd) {
//                     customer.valid = true;
//                     customer.email = users[i].email;
//                     customer.username = users[i].username;
//                     customer.role = users[i].role;
    
//                 }
//             }
//             res.send(customer);
            
//             }catch(err){
//               console.log("Error pasing the userdata");
//             }
              
//            })
     
       

       

//     });
// }

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
                    role: user.role
                };
                res.send(customer);
            } else {
                // Không tìm thấy người dùng, gửi thông báo về phía client
                const customer = {
                    valid: false,
                    email: '',
                    username: '',
                    role: ''
                };
                res.send(customer);
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    });
};
