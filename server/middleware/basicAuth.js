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


function authRole(roles) {
  return (req, res, next) => {
    const { user } = req; // get user information from request
    if (!user) {
      res.status(401);
      return res.send('Not allowed');
    }
//always being an aray even it's not
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    
    if (!Array.isArray(roles)) {
      roles = [roles]; // transfer role to array if it is not an array
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
