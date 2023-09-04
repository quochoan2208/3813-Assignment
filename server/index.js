var express = require('express');
var app = express();
var http = require('http').Server(app);
const PORT = 3000;
const cors = require('cors'); 
const path = require('path');
const {authPage, authRole} = require ('./middleware/basicAuth.js');
const userData = require('./data/users.json').people; 

const bodyParser = require('body-parser');
app.use(cors());
app.get('/',(req,res)=> {
  res.send('Homepage!')
})

app.use('/images',express.static('userimages'));

var fs = require('fs');
const formidable = require('formidable');
app.use (express.json()); 
app.use(bodyParser.json());
const route = express.Router();


// app.get('/getlists', authPage(['SUP','GRO']), (req, res, next) => {
//   console.log('Handling GET /getlists');
//   res.send('Get list Student');
// })
app.get('/dashboard',authPage,(req,res,next)=>{
  res.send('Welcome to dashboard')
})
app.get('/groupadmin',authPage,authRole(["GRO","SUP"]),(req,res,next)=>{
  res.send('Welcome to Group admin')
})
app.get('/admin',authPage,authRole("SUP"),(req,res,next)=>{
  res.send('Welcome to admin')
})
// route.get('/:number',(req,res,next)=> {
//   res.send('You have permission to access this course!');
// })
require('./routes/api-login.js')(app,path,fs);


require('./listen.js')(http,PORT);