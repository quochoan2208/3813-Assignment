const fs = require('fs');
const path = require('path');
const userDataFilePath = path.join(__dirname, '../data/users.json');
const userData = JSON.parse(fs.readFileSync(userDataFilePath, 'utf8'));

function authPage(req, res, next) {
  const { email, pwd } = req.body; // Assumed that the request body contains email and pwd fields

  if (!email || !pwd) {
    res.status(400);
    return res.send('Invalid request. Email and password are required.');
  }

  const user = userData.people.find(u => u.email === email && u.pwd === pwd);

  if (!user) {
    res.status(403);
    return res.send('Invalid email or password.');
  }

  // Assuming you want to store the authenticated user data for future requests
  req.user = user;

  next();
}
// function authRole(roles) {
//   return (req, res, next) => {
//     const { user } = req; // Lấy thông tin người dùng từ yêu cầu, bạn đã thiết lập nó trong middleware authPage
//     if (!user ) {
//       res.status(401);
//       return res.send('Not allowed');
//     }
//     const userRoles = Array.isArray(user.role) ? user.role : [user.role]
//     if (!Array.isArray(user.role)) {
//       roles = [roles]
//     }

//     if (!roles.some(role => userRoles.include(role))) {
//       res.status(401);
//       return res.send('Not allowed');
//     }
//     // if (!authorized) {
//     //   res.status(401);
//     //   return res.send('Not allowed');
//     // }
//     next();
//   };
// }

function authRole(roles) {
  return (req, res, next) => {
    const { user } = req; // Lấy thông tin người dùng từ yêu cầu
    if (!user) {
      res.status(401);
      return res.send('Not allowed');
    }
//always being an aray even it's not
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    
    if (!Array.isArray(roles)) {
      roles = [roles]; // Chuyển roles thành một mảng nếu nó không phải là mảng
    }

    if (!roles.some(role => userRoles.includes(role))) {
      res.status(401);
      return res.send('Not allowed');
    }

    next();
  };
}
module.exports = {
  authPage,authRole
};