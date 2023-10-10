const fs = require('fs');
const path = require('path');
const userDataFilePath = path.join(__dirname, '../data/users.json');
const userData = JSON.parse(fs.readFileSync(userDataFilePath, 'utf8'));
const roomsDataFilePath = path.join(__dirname, '../data/room.json');
let rooms = [];
const User = require('../datauser.js');

if (fs.existsSync(roomsDataFilePath)) {
  const roomsData = fs.readFileSync(roomsDataFilePath, 'utf8');
  rooms = JSON.parse(roomsData);
}

module.exports = {
  

    connect: function(io,PORT){
        io.on('connection', (socket) => {
            console.log('A user connected');


            function sendUpdatedRoomList() {
                io.emit('updatedRoomList', rooms);
                console.log("this is the testing",JSON.stringify(rooms))
              }
              socket.on('roomlist',
              ()=>{
                socket.emit('roomlist',JSON.stringify(rooms));
                });
              socket.on('createRoom', (roomName) => {
                const existingRoom = rooms.find((room) => room.name === roomName);
                if (existingRoom) {
                  socket.emit('roomCreationError', 'Room with the same name already exists.');
                } else {
                  const newRoom = {
                    id: rooms.length + 1,
                    name: roomName,
                    channels: [],
                    users: [],
                  };
                  rooms.push(newRoom);
                  io.emit('roomCreated', newRoom);
                  sendUpdatedRoomList();
        
                  // Ghi dữ liệu mới vào tệp JSON phòng
                  fs.writeFileSync(roomsDataFilePath, JSON.stringify(rooms), 'utf8');
        
                  console.log(`Room "${newRoom.name}" created.`);
                }
              });
              socket.on('joinRoom', ({ roomId, userId }) => {
                const room = rooms.find((room) => room.id === roomId);
                if (room) {
                  if (!room.users.includes(userId)) {
                    room.users.push(userId);
                    io.to(roomId).emit('userJoined', userId);
              
                    // Cập nhật thông tin phòng trong mảng `rooms`
                    const roomIndex = rooms.findIndex((r) => r.id === roomId);
                    if (roomIndex !== -1) {
                      rooms[roomIndex] = room;
              
                      // Ghi dữ liệu phòng vào tệp JSON
                      fs.writeFileSync(roomsDataFilePath, JSON.stringify(rooms), 'utf8');
                    }
                    
                    socket.emit('joinRoomSuccess', room);
                  } else {
                    socket.emit('joinRoomError', 'User is already in this room.');
                  }
                } else {
                  socket.emit('joinRoomError', 'Room does not exist.');
                }
              });


              socket.on('addUser', async (newUser) => {
                try {
                  const existingUserByName = await User.findOne({ username: newUser.username });
                  const existingUserByEmail = await User.findOne({ email: newUser.email });
              
                  if (existingUserByName) {
                    socket.emit('userCreationError', 'Username already exists.');
                  } else if (existingUserByEmail) {
                    socket.emit('userCreationError', 'Email already exists.');
                  } else {
                    // Thêm người dùng mới vào MongoDB
                    const createdUser = await User.create(newUser);
                    createdUser.id = User.length + 1;
                    await createdUser.save();
              
                    io.emit('userAdded', createdUser);
                    console.log(`User "${createdUser.username}" added.`);
                  }
                } catch (error) {
                  console.error(error);
                  socket.emit('userCreationError', 'Error creating user.');
                }
              });
              
              // socket.on('addUser', (newUser) => {
                
              //   const existingUserByName = userData.people.find((user) => user.username === newUser.username);
              
                
              //   const existingUserByEmail = userData.people.find((user) => user.email === newUser.email);
              
              //   if (existingUserByName) {
                  
              //     socket.emit('userCreationError', 'Username already exists.');
              //   } else if (existingUserByEmail) {
                  
              //     socket.emit('userCreationError', 'Email already exists.');
              //   } else {
              
              //     newUser.id = userData.people.length + 1
              //     userData.people.push(newUser);
              
              //     fs.writeFileSync(userDataFilePath, JSON.stringify(userData), 'utf8');
              
              //     io.emit('userAdded', newUser);
              
              //     console.log(`User "${newUser.username}" added.`);
              //     console.log(userData);
              //   }
              // });
              
              socket.on('addUserToRoom', ({ userId, roomId }) => {
                const room = rooms.find((room) => room.id === roomId);
                if (room) {
                  if (!room.users.includes(userId)) {
                    room.users.push(userId);
                    io.to(roomId).emit('userAddedToRoom', { userId, roomId });
              
                    // Cập nhật thông tin phòng trong mảng `rooms`
                    const roomIndex = rooms.findIndex((r) => r.id === roomId);
                    if (roomIndex !== -1) {
                      rooms[roomIndex] = room;
              
                      // Ghi dữ liệu phòng vào tệp JSON
                      fs.writeFileSync(roomsDataFilePath, JSON.stringify(rooms), 'utf8');
                    }
                  } else {
                    socket.emit('userAddToRoomError', 'User is already in this room.');
                  }
                } else {
                  socket.emit('userAddToRoomError', 'Room does not exist.');
                }
              });
              
              socket.on('addChannelToRoom', (data) => {
                const { channelName, roomId } = data;
              
                const room = rooms.find((room) => room.id === roomId);
                if (room) {
                  const newChannel = {
                    name: channelName,
                  };
              
                  room.channels.push(newChannel);
              
                  io.to(roomId).emit('channelCreated', newChannel);
                  sendUpdatedRoomList();
              
                  // Cập nhật thông tin phòng trong mảng `rooms`
                  const roomIndex = rooms.findIndex((r) => r.id === roomId);
                  if (roomIndex !== -1) {
                    rooms[roomIndex] = room;
              
                    // Ghi dữ liệu phòng vào tệp JSON
                    fs.writeFileSync(roomsDataFilePath, JSON.stringify(rooms), 'utf8');
                  }
                } else {
                  socket.emit('channelCreationError', 'Room does not exist.');
                }
              });

              socket.on('leaveRoom', (roomId, userId) => {
                const roomIndex = rooms.findIndex((room) => room.id === roomId);
                if (roomIndex !== -1) {
                  const userIndex = rooms[roomIndex].users.indexOf(userId);
                  if (userIndex !== -1) {
                    rooms[roomIndex].users.splice(userIndex, 1);
                    io.to(roomId).emit('userLeft', userId);
                    socket.emit('leaveRoomSuccess', rooms[roomIndex]);
              
                    // Cập nhật thông tin phòng trong tệp JSON
                    fs.writeFileSync(roomsDataFilePath, JSON.stringify(rooms), 'utf8', (err) => {
                      if (err) {
                        console.error('Error writing to JSON file:', err);
                      } else {
                        console.log('Room data updated successfully.');
                      }
                    });
                  } else {
                    socket.emit('leaveRoomError', 'You are not in this room.');
                  }
                } else {
                  socket.emit('leaveRoomError', 'Room does not exist.');
                }
              });
              
              
              socket.on('deleteUser', (userId) => {
                console.log(userData)
             
                const userIndex = userData.people.findIndex((user) => user.id === userId);
              
                if (userIndex !== -1) {
                  
                  userData.people.splice(userIndex, 1);
              
                 
                  fs.writeFileSync(userDataFilePath, JSON.stringify(userData), 'utf8');
              
                
                  socket.emit('userDeleted', userId);
              
                  console.log(`User with ID ${userId} has been deleted.`);
                  console.log(userData)
                } else {
                  
                  socket.emit('userDeleteError', 'User not found.');
                }
              });
           
              
              socket.on('getUsersList', async () => {
                try {
                  // Sử dụng Mongoose để lấy danh sách người dùng từ MongoDB
                  const userList = await User.find({}, '-password'); // '-password' để loại bỏ trường mật khẩu nếu bạn muốn
              
                  socket.emit('usersList', userList);
                } catch (error) {
                  console.error(error);
                  socket.emit('usersListError', 'Error getting user list.');
                }
              });
              
              // socket.on('getUsersList', () => {
              
              //   const userList = userData.people;
            
               
              //   socket.emit('usersList', userList);
              // });
              // socket.on('deleteUser', (userId) => {
              //   console.log(userData)
             
              //   const userIndex = userData.people.findIndex((user) => user.id === userId);
              
              //   if (userIndex !== -1) {
                  
              //     userData.people.splice(userIndex, 1);
              
                 
              //     fs.writeFileSync(userDataFilePath, JSON.stringify(userData), 'utf8');
              
                
              //     socket.emit('userDeleted', userId);
              
              //     console.log(`User with ID ${userId} has been deleted.`);
              //     console.log(userData)
              //   } else {
                  
              //     socket.emit('userDeleteError', 'User not found.');
              //   }
              // });

              socket.on('deleteUser', async (userId) => {
                try {
                  const deletedUser = await User.findOneAndRemove({ id: userId });
              
                  if (!deletedUser) {
                    socket.emit('userDeleteError', 'User not found.');
                  } else {
                    socket.emit('userDeleted', userId);
                    console.log(`User with ID ${userId} has been deleted.`);
                  }
                } catch (error) {
                  console.error(error);
                  socket.emit('userDeleteError', 'Error deleting user.');
                }
              });
              
           

              socket.on('addUserToChannel', ({ channelName, roomId, userId }) => {
                // Tìm phòng theo roomId
                const room = rooms.find((room) => room.id === roomId);
                
                if (room) {
                  
                  const channel = room.channels.find((ch) => ch.name === channelName);
              
                  if (channel) {
                    
                    if (!channel.users.includes(userId)) {
                     
                      channel.users.push(userId);
              
                 
                      io.to(channelName).emit('userAddedToChannel', { channelName, userId });
              
                    
                      sendUpdatedRoomList();
                    } else {
                      
                      socket.emit('userAddToChannelError', 'User is already in this channel.');
                    }
                  } else {
                
                    socket.emit('channelAddToChannelError', 'Channel does not exist in this room.');
                  }
                } else {
                 
                  socket.emit('roomAddToChannelError', 'Room does not exist.');
                }
              });
              

 

socket.on('deleteRoom', (roomId) => {
  const index = rooms.findIndex((room) => room.id === roomId);
  if (index !== -1) {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id > roomId) {
        rooms[i].id--;
      }
    }
    rooms.splice(index, 1);
    io.emit('roomDeleted', roomId);

    // Ghi lại dữ liệu vào file JSON sau khi xóa phòng
    fs.writeFileSync(roomsDataFilePath, JSON.stringify(rooms), 'utf8');

    sendUpdatedRoomList();
  }
});

          
            socket.on('message', (message) => {
              console.log(`Received message: ${message}`);

            });
            
          
            socket.on('disconnect', () => {
              console.log('A user disconnected');
            });
          });
    }
}