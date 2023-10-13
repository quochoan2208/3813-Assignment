var express = require('express');
var app = express();
var http = require('http').Server(app);
const PORT = 3000;
const multer = require('multer');

const mongoose = require('mongoose');
const cors = require('cors'); 
const path = require('path');
const storage = multer.memoryStorage(); // Lưu trữ tệp ảnh trong bộ nhớ
const upload = multer({ storage: storage });
const {authPage, authRole} = require ('./middleware/basicAuth.js');
const userData = require('./data/users.json').people; 
const io = require('socket.io')(http,{
  cors: {
    origin: 'http://localhost:4200',
    methods: ["GET","POST"]
  }
})
const datauser = require('./datauser.js');
const roomdata = require('./roomdata.js');


const sockets = require('./routes/socket.js');
sockets.connect(io, PORT);

const bodyParser = require('body-parser');
app.use(cors());
app.get('/',(req,res)=> {
  res.send('Homepage!')
 
})

findUser();
async function findUser(){ 
  try {
    const Users = await datauser.find();
    // res.send(Users);
    console.log(Users)
} catch (err) {
    console.error(err);
   
}
}


async function findRoom(){ 
  try {
    const Rooms = await roomdata.find();
    // res.send(Users);
    console.log(Rooms)
} catch (err) {
    console.error(err);
   
}
}
findRoom();

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

require('./routes/api-login.js')(app,path,fs);
require('./routes/uploads.js')(app,formidable,fs,path);
// app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//     }

//     // Xác định thông tin đăng nhập hoặc xác thực, ví dụ: email
//     const userEmail = req.body.email; // Thay đổi cách bạn xác định thông tin đăng nhập

//     // Tìm người dùng trong MongoDB dựa trên email
//     datauser.findOne({ email: userEmail }, (err, user) => {
//       if (err) {
//         return res.status(500).send('Error finding user.');
//       }

//       if (!user) {
//         return res.status(404).send('User not found.');
//       }

//       // Cập nhật trường "avatar" của người dùng với dữ liệu tệp ảnh
//       user.avatar = req.file.buffer;

//       // Lưu thông tin người dùng đã cập nhật
//       user.save((err) => {
//         if (err) {
//           return res.status(500).send('Error updating user avatar.');
//         }

//         return res.status(200).send('Avatar uploaded and user updated.');
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error uploading avatar.');
//   }
// });



require('./listen.js')(http,PORT);