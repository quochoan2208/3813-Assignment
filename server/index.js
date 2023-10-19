var express = require('express');
var app = express();
var http = require('http').Server(app);
const PORT = 3000;
const multer = require('multer');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);
const server = require('./routes/socket'); 
const sinon = require('sinon');


const socketURL = `http://localhost:${PORT}`; 
const ioClient = require('socket.io-client');
const mongoose = require('mongoose');
const cors = require('cors'); 
const path = require('path');
const storage = multer.memoryStorage(); 
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

//First test


// describe('Authentication Route', function () {
//   it('should authenticate a user', function (done) {
//     chai
//       .request(app)
//       .post('/api/auth')
//       .send({ email: 'abg@com.au', upwd: '123' })
//       .end(function (err, res) {
//         expect(res).to.have.status(200);

//         // check response and user information
//         expect(res.body).to.have.property('valid', true);
//         expect(res.body).to.have.property('email', 'abg@com.au');
//         expect(res.body).to.have.property('username');
//         expect(res.body).to.have.property('role');
//         expect(res.body).to.have.property('id');

//         done();
//       });
//   });
// });




describe('Socket Functions', function () {
  let clientSocket;

  before(function (done) {
    // connect to socket
    clientSocket = ioClient.connect(socketURL, {
      reconnection: false
    });

    clientSocket.on('connect', () => {
      console.log('Socket connected successfully');
      done();
    });
  });

  after(function () {
    // Disconect with socket after finish
    clientSocket.close();
  });



  it('should log "A user connected"', function (done) {
    const log = sinon.spy(console, 'log');

    // connect to socket server
    clientSocket = ioClient.connect(socketURL, {
      reconnection: false
    });

    // listen to "connect"
    clientSocket.on('connect', () => {
      // check `console.log` if success
      sinon.assert.calledWith(log, 'A user connected');

      
      log.restore();
      done();
    });
  });
  it('should receive a roomlist', function (done) {
    // Send request roomlist from client
    clientSocket.emit('roomlist');

    // listen to event 'roomlist' from server
    clientSocket.on('roomlist', (data) => {
    

       //check if data is exist and not null
      expect(data).to.exist;
      expect(data).to.not.be.empty;

      done();
    });
    
  });
  // it('should create a room', function (done) {
    
  //   clientSocket.emit('createRoom', 'New Room 2'); // send requset of create room from socket
  //   // listen to "roomCreated" from socket
  //   clientSocket.on('roomCreated', (newRoom) => {
  //     expect(newRoom).to.have.property('id');
  //     expect(newRoom).to.have.property('name', 'New Room 2');
  //     expect(newRoom).to.have.property('channels');
  //     expect(newRoom).to.have.property('users');
  //     done();
  //   });
    
  // });
  // it('should join a room', function (done) {
  //   // send request joinRoom from client
  //   const roomId = 9;  
  //   const userId = 1; 
  
  //   clientSocket.emit('joinRoom', { roomId, userId });
  
  //   // Nghe sự kiện 'joinRoomSuccess' hoặc 'joinRoomError' từ server
  //   clientSocket.on('joinRoomSuccess', (room) => {
  //     // check if room has been joined success
  //     expect(room.users).to.include(userId);
  
  //     
  //     done();
  //   });
  
  //   clientSocket.on('joinRoomError', (error) => {
  //     // fix error if has
  //     done(error);
  //   });
  // });
  // it('should add a user', function (done) {
  //   const newUser = {
  //     username: 'newUser',
  //     email: 'newuser@example.com',
  //     // Thêm các trường dữ liệu khác cần thiết cho người dùng ở đây
  //   };
  
  //   // Gửi yêu cầu addUser từ client với thông tin newUser
  //   clientSocket.emit('addUser', newUser);
  
  //   // Nghe sự kiện 'userAdded' hoặc 'userCreationError' từ server
  //   clientSocket.on('userAdded', (createdUser) => {
  //     // Kiểm tra rằng người dùng đã được thêm thành công
  //     expect(createdUser.username).to.equal(newUser.username);
  //     expect(createdUser.email).to.equal(newUser.email);
  //     // Thêm các kiểm tra cho các trường dữ liệu khác nếu cần
  
  //     // Hoàn thành kiểm tra
  //     done();
  //   });
  
  //   clientSocket.on('userCreationError', (error) => {
  //     // Xử lý lỗi nếu có
  //     done(error);
  //   });
  // });
  


  // it('should add a user to a room', function (done) {
  //   const userId = 6; 
  //   const roomId = 10; 
  
  //   // Send request addUserToRoom from client with userId and roomId
  //   clientSocket.emit('addUserToRoom', { userId, roomId });
  
  //   // Listen to 'userAddedToRoom' or 'userAddToRoomError' from server
  //   clientSocket.on('userAddedToRoom', ({ userId: receivedUserId, roomId: receivedRoomId }) => {
  //     // check if user has been added into room with userId and roomId 
  //     expect(receivedUserId).to.equal(userId); // compare received userId with expectation userId 
  //     expect(receivedRoomId).to.equal(roomId); // compare roomId with expectation roomId 
  
      
  //     done();
  //   });
  //   done()
  // });
  it('should leave a room successfully', function (done) {
    const fakeRoomId = 9; 
    const fakeUserId = 6; 
  
    // call `socket.on('leaveRoom', ...)`, push valid variable
    clientSocket.emit('leaveRoom', fakeRoomId, fakeUserId);
  
    // listen to 'leaveRoomSuccess' or 'leaveRoomError' from socket
    clientSocket.on('leaveRoomSuccess', (room) => {
      // test if user left room success or not
      // test as app logic
      expect(room).to.exist; // make sure that room has been sent back
      expect(room.users).to.not.include(fakeUserId); // make sure nobody in the room
      
  
      
      done();
    });
  
    clientSocket.on('leaveRoomError', (error) => {
      // check error
      done(error);
    });
  });
  it('should return a list of users', function (done) {
    // send request 'getUsersList' from client
    clientSocket.emit('getUsersList');

    // Nghe sự kiện 'usersList' từ server
    clientSocket.on('usersList', (userList) => {
      // send user list which has been sent back
      expect(userList).to.be.an('array');
     
      done();
    });

    clientSocket.on('usersListError', (error) => {
      // check error
      done(new Error('Error getting user list: ' + error));
    });
  });
  // it('should delete a room', function (done) {
  //   // send request 'deleteRoom' from client with roomId
  //   const roomIdToDelete = 10; 
  //   clientSocket.emit('deleteRoom', roomIdToDelete);

  //   // listen to 'roomDeleted' or 'roomDeleteError' from server
  //   clientSocket.on('roomDeleted', (deletedRoomId) => {
  //     // ensure that room has been succesfully deleted
  //     expect(deletedRoomId).to.equal(roomIdToDelete);

  //     
  //     done();
  //   });

  //   clientSocket.on('roomDeleteError', (error) => {
  //     // check error
  //     done(new Error('Error deleting room: ' + error));
  //   });
  // });
  // it('should get users in a room', function (done) {
  //   // send request 'getUsersInRoom' from client to roomId
  //   const roomId = 9; 
  //   clientSocket.emit('getUsersInRoom', roomId);
  
  //   // listen to 'usersInRoom' or 'usersInRoomError' from server
  //   clientSocket.on('usersInRoom', (usersInRoom) => {
  //     try {
  //       
  //       expect(usersInRoom).to.be.an('array'); // check if usersInRoom is an array
  //      
  //       // expect(usersInRoom).to.have.lengthOf(2); // check if there are 3 people in room
  //       // expect(usersInRoom[0]).to.have.property('username', 'user1'); // check the information
  //       // ...
  
  //       
  //       done();
  //     } catch (error) {
  //       done(error); // get error if there are some
  //     }
  //   });
  
  //   clientSocket.on('usersInRoomError', (error) => {
  //     // check error
  //     done(new Error('Error fetching users in room: ' + error));
  //   });
  // });
  // it('should get users in a room', function (done) {
  //   // Send request 'getUsersInRoom' from client with roomId
  //   const roomId = 9; 
  //   clientSocket.emit('getUsersInRoom', roomId);
  
  //   // Nghe sự kiện 'usersInRoom' hoặc 'usersInRoomError' từ server
  //   clientSocket.on('usersInRoom', (usersInRoom) => {
  //     try {
  //       // check if usersInRoom is an array
  //       if (!Array.isArray(usersInRoom)) {
  //         throw new Error('Returned data is not an array.');
  //       }
  

  //       
  //       expect(usersInRoom).to.have.lengthOf(2); // check if there are 2 inside the room
  //       // expect(usersInRoom[0]).to.have.property('username', 'user1'); // check user infor
  
  //       
  //       done();
  //     } catch (error) {
  //       done(error); 
  //     }
  //   });
  
  //   clientSocket.on('usersInRoomError', (error) => {
  //   
  //     done(new Error('Error fetching users in room: ' + error));
  //   });
  // });
  it('should send a message to a room', function (done) {
    // send request 'messageforroom' from client to consist data
    const roomId = 9; 
    const userId = 1; 
    const username = 'Noah'; 
    const text = 'Testing is success'; 

    clientSocket.emit('messageforroom', { roomId, userId, username, text });

    // listen to 'messageforroom' from server
    clientSocket.on('messageforroom', (message) => {
      // make sure that messsage has been sent is success
      expect(message.roomId).to.equal(roomId);
      expect(message.userId).to.equal(userId);
      expect(message.username).to.equal(username);
      expect(message.text).to.equal(text);


      done();
    });
  });
  it('should disconnect the client and remove from all rooms', function (done) {
    // send request 'disconnect' from client
    clientSocket.disconnect();

    // listen to'disconnect' from server
    clientSocket.on('disconnect', () => {
      // check if client has been discconect or not
      // check if the client has been successfully disconeted
      expect(clientSocket.connected).to.be.false;

     
      done();
    });
    done();
  });
  
    });
  
  
  

  





require('./listen.js')(http,PORT);

