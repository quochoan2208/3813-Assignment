var express = require('express');
var app = express();
var http = require('http').Server(app);
const PORT = 3000;
const cors = require('cors'); 
const path = require('path');
const {authPage, authRole} = require ('./middleware/basicAuth.js');
const userData = require('./data/users.json').people; 
const io = require('socket.io')(http,{
  cors: {
    origin: 'http://localhost:4200',
    methods: ["GET","POST"]
  }
})
const sockets = require('./routes/socket.js');
sockets.connect(io, PORT);

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


app.get('/USER',authPage,(req,res,next)=>{
  res.send('Welcome to dashboard')
})
app.get('/GRO',authPage,authRole(["GRO","SUP"]),(req,res,next)=>{
  res.send('Welcome to Group admin')
})
app.get('/SUP',authPage,authRole("SUP"),(req,res,next)=>{
  res.send('Welcome to admin')
})
// route.get('/:number',(req,res,next)=> {
//   res.send('You have permission to access this course!');
// })
require('./routes/api-login.js')(app,path,fs);


require('./listen.js')(http,PORT);