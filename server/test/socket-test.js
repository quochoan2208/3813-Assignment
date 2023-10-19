var express = require('express');
var app = express();
var http = require('http').Server(app);
const PORT = 3000;
const multer = require('multer');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);
const server = require('../routes/socket'); // Import tệp socket.js
const sinon = require('sinon');


const socketURL = `http://localhost:${PORT}`; // URL của server socket
const ioClient = require('socket.io-client');
const mongoose = require('mongoose');
const cors = require('cors'); 
const path = require('path');
const storage = multer.memoryStorage(); // Lưu trữ tệp ảnh trong bộ nhớ
const upload = multer({ storage: storage });


const io = require('socket.io')(http,{
  cors: {
    origin: 'http://localhost:4200',
    methods: ["GET","POST"]
  }
})



const sockets = require('../routes/socket.js');
sockets.connect(io, PORT);

const bodyParser = require('body-parser');
app.use(cors());

describe('Socket Functions', function () {
  let clientSocket;

  before(function (done) {
    // Kết nối đến server socket giả lập
    clientSocket = ioClient.connect(socketURL, {
      reconnection: false
    });

    clientSocket.on('connect', () => {
      console.log('Socket connected successfully');
      done();
    });
  });

  after(function () {
    // Đóng kết nối socket sau khi hoàn thành kiểm thử
    clientSocket.close();
  });



  it('should log "A user connected"', function (done) {
    const log = sinon.spy(console, 'log');

    // Kết nối đến server socket giả lập
    clientSocket = ioClient.connect(socketURL, {
      reconnection: false
    });

    // Nghe sự kiện "connect"
    clientSocket.on('connect', () => {
      // Kiểm tra xem `console.log` đã được gọi với đúng chuỗi
      sinon.assert.calledWith(log, 'A user connected');

      // Trả lại hàm `console.log` về trạng thái ban đầu sau khi hoàn thành kiểm tra
      log.restore();
      done();
    });
  });
  it('should receive a roomlist', function (done) {
    // Gửi yêu cầu roomlist từ client
    clientSocket.emit('roomlist');

    // Nghe sự kiện 'roomlist' từ server
    clientSocket.on('roomlist', (data) => {
      // Đảm bảo bạn kiểm tra dữ liệu (data) được trả về một cách phù hợp.

      // Ví dụ: Kiểm tra dữ liệu có tồn tại và không rỗng
      expect(data).to.exist;
      expect(data).to.not.be.empty;

      // Hoàn thành kiểm tra
      done();
    });
    
  });
  // it('should create a room', function (done) {
    
  //   clientSocket.emit('createRoom', 'New Room 2'); // Gửi yêu cầu tạo phòng qua socket
  //   // Nghe sự kiện "roomCreated" từ máy chủ socket
  //   clientSocket.on('roomCreated', (newRoom) => {
  //     expect(newRoom).to.have.property('id');
  //     expect(newRoom).to.have.property('name', 'New Room 2');
  //     expect(newRoom).to.have.property('channels');
  //     expect(newRoom).to.have.property('users');
  //     done();
  //   });
    
  // });
  // it('should join a room', function (done) {
  //   // Gửi yêu cầu joinRoom từ client
  //   const roomId = 9; // Thay thế bằng roomId thích hợp
  //   const userId = 1; // Thay thế bằng userId thích hợp
  
  //   clientSocket.emit('joinRoom', { roomId, userId });
  
  //   // Nghe sự kiện 'joinRoomSuccess' hoặc 'joinRoomError' từ server
  //   clientSocket.on('joinRoomSuccess', (room) => {
  //     // Kiểm tra rằng room đã được tham gia thành công
  //     expect(room.users).to.include(userId);
  
  //     // Hoàn thành kiểm tra
  //     done();
  //   });
  
  //   clientSocket.on('joinRoomError', (error) => {
  //     // Xử lý lỗi nếu có
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
  //   const userId = 3; // Thay thế bằng userId mong muốn
  //   const roomId = 9; // Thay thế bằng roomId mong muốn
  
  //   // Gửi yêu cầu addUserToRoom từ client với thông tin userId và roomId
  //   clientSocket.emit('addUserToRoom', { userId, roomId });
  
  //   // Nghe sự kiện 'userAddedToRoom' hoặc 'userAddToRoomError' từ server
  //   clientSocket.on('userAddedToRoom', ({ userId: receivedUserId, roomId: receivedRoomId }) => {
  //     // Kiểm tra rằng người dùng đã được thêm vào phòng thành công với userId và roomId mong muốn
  //     expect(receivedUserId).to.equal(userId); // So sánh userId nhận được với userId mong muốn
  //     expect(receivedRoomId).to.equal(roomId); // So sánh roomId nhận được với roomId mong muốn
  
  //     // Hoàn thành kiểm tra
  //     done();
  //   });
  //   done()
  // });
  it('should leave a room successfully', function (done) {
    const fakeRoomId = 9; // Thay thế bằng roomId thích hợp
    const fakeUserId = 3; // Thay thế bằng userId thích hợp
  
    // Gọi hàm `socket.on('leaveRoom', ...)`, truyền vào các giá trị tương ứng
    clientSocket.emit('leaveRoom', fakeRoomId, fakeUserId);
  
    // Nghe sự kiện 'leaveRoomSuccess' hoặc 'leaveRoomError' từ socket
    clientSocket.on('leaveRoomSuccess', (room) => {
      // Kiểm tra rằng người dùng đã rời phòng thành công
      // Thực hiện kiểm tra theo logic của ứng dụng
      expect(room).to.exist; // Đảm bảo phòng đã trả về
      expect(room.users).to.not.include(fakeUserId); // Đảm bảo người dùng không còn trong phòng
      // Thực hiện kiểm tra khác nếu cần
  
      // Đánh dấu kiểm tra đã hoàn thành thành công
      done();
    });
  
    clientSocket.on('leaveRoomError', (error) => {
      // Xử lý lỗi nếu có
      done(error);
    });
  });
  it('should return a list of users', function (done) {
    // Gửi yêu cầu 'getUsersList' từ client
    clientSocket.emit('getUsersList');

    // Nghe sự kiện 'usersList' từ server
    clientSocket.on('usersList', (userList) => {
      // Kiểm tra rằng danh sách người dùng đã được trả về
      expect(userList).to.be.an('array');
      // Thực hiện các kiểm tra khác dựa trên logic của ứng dụng
      done();
    });

    clientSocket.on('usersListError', (error) => {
      // Xử lý lỗi nếu có
      done(new Error('Error getting user list: ' + error));
    });
  });
  // it('should delete a room', function (done) {
  //   // Gửi yêu cầu 'deleteRoom' từ client với roomId
  //   const roomIdToDelete = 10; // Thay thế bằng roomId thích hợp
  //   clientSocket.emit('deleteRoom', roomIdToDelete);

  //   // Nghe sự kiện 'roomDeleted' hoặc 'roomDeleteError' từ server
  //   clientSocket.on('roomDeleted', (deletedRoomId) => {
  //     // Kiểm tra rằng phòng đã được xóa thành công
  //     expect(deletedRoomId).to.equal(roomIdToDelete);

  //     // Hoàn thành kiểm tra
  //     done();
  //   });

  //   clientSocket.on('roomDeleteError', (error) => {
  //     // Xử lý lỗi nếu có
  //     done(new Error('Error deleting room: ' + error));
  //   });
  // });
  // it('should get users in a room', function (done) {
  //   // Gửi yêu cầu 'getUsersInRoom' từ client với roomId
  //   const roomId = 9; // Thay thế bằng roomId thích hợp
  //   clientSocket.emit('getUsersInRoom', roomId);
  
  //   // Nghe sự kiện 'usersInRoom' hoặc 'usersInRoomError' từ server
  //   clientSocket.on('usersInRoom', (usersInRoom) => {
  //     try {
  //       // Thực hiện các kiểm tra cụ thể cho kết quả trả về
  //       expect(usersInRoom).to.be.an('array'); // Kiểm tra rằng usersInRoom là một mảng
  //       // Thực hiện kiểm tra cụ thể dựa trên logic ứng dụng, ví dụ:
  //       // expect(usersInRoom).to.have.lengthOf(2); // Kiểm tra rằng có 3 người dùng trong phòng
  //       // expect(usersInRoom[0]).to.have.property('username', 'user1'); // Kiểm tra thông tin của người dùng
  //       // ...
  
  //       // Hoàn thành kiểm tra
  //       done();
  //     } catch (error) {
  //       done(error); // Trả về lỗi nếu có lỗi trong quá trình kiểm tra
  //     }
  //   });
  
  //   clientSocket.on('usersInRoomError', (error) => {
  //     // Xử lý lỗi nếu có
  //     done(new Error('Error fetching users in room: ' + error));
  //   });
  // });
  // it('should get users in a room', function (done) {
  //   // Gửi yêu cầu 'getUsersInRoom' từ client với roomId
  //   const roomId = 9; // Thay thế bằng roomId thích hợp
  //   clientSocket.emit('getUsersInRoom', roomId);
  
  //   // Nghe sự kiện 'usersInRoom' hoặc 'usersInRoomError' từ server
  //   clientSocket.on('usersInRoom', (usersInRoom) => {
  //     try {
  //       // Kiểm tra xem usersInRoom có phải là mảng không
  //       if (!Array.isArray(usersInRoom)) {
  //         throw new Error('Returned data is not an array.');
  //       }
  
  //       // Thực hiện các kiểm tra cụ thể cho kết quả trả về
  //       // Ví dụ, kiểm tra chiều dài mảng, kiểm tra các thuộc tính của mỗi phần tử trong mảng, vv.
  //       expect(usersInRoom).to.have.lengthOf(2); // Kiểm tra rằng có 3 người dùng trong phòng
  //       // expect(usersInRoom[0]).to.have.property('username', 'user1'); // Kiểm tra thông tin của người dùng
  
  //       // Hoàn thành kiểm tra
  //       done();
  //     } catch (error) {
  //       done(error); // Trả về lỗi nếu có lỗi trong quá trình kiểm tra
  //     }
  //   });
  
  //   clientSocket.on('usersInRoomError', (error) => {
  //     // Xử lý lỗi nếu có
  //     done(new Error('Error fetching users in room: ' + error));
  //   });
  // });
  it('should send a message to a room', function (done) {
    // Gửi yêu cầu 'messageforroom' từ client với dữ liệu tương ứng
    const roomId = 9; // Thay thế bằng roomId thích hợp
    const userId = 1; // Thay thế bằng userId thích hợp
    const username = 'Noah'; // Thay thế bằng tên người dùng thích hợp
    const text = 'Testing is success'; // Thay thế bằng nội dung tin nhắn thích hợp

    clientSocket.emit('messageforroom', { roomId, userId, username, text });

    // Nghe sự kiện 'messageforroom' từ server
    clientSocket.on('messageforroom', (message) => {
      // Kiểm tra rằng tin nhắn đã được gửi thành công
      expect(message.roomId).to.equal(roomId);
      expect(message.userId).to.equal(userId);
      expect(message.username).to.equal(username);
      expect(message.text).to.equal(text);

      // Hoàn thành kiểm tra
      done();
    });
  });
  it('should disconnect the client and remove from all rooms', function (done) {
    // Gửi yêu cầu 'disconnect' từ client
    clientSocket.disconnect();

    // Nghe sự kiện 'disconnect' từ server
    clientSocket.on('disconnect', () => {
      // Kiểm tra rằng client đã bị ngắt kết nối
      // Đảm bảo bạn kiểm tra xem client đã bị ngắt kết nối khỏi tất cả các phòng
      expect(clientSocket.connected).to.be.false;

      // Hoàn thành kiểm tra
      done();
    });
    done();
  });
  
    });