const fs = require('fs');
const path = require('path');
const userDataFilePath = path.join(__dirname, '../data/users.json');
const userData = JSON.parse(fs.readFileSync(userDataFilePath, 'utf8'));

const roomsDataFilePath = path.join(__dirname, '../data/room.json');
let rooms = [];
const User = require('../datauser.js');
const Room = require('../roomdata.js');
const rooms2 = [];

if (fs.existsSync(roomsDataFilePath)) {
  const roomsData = fs.readFileSync(roomsDataFilePath, 'utf8');
  rooms = JSON.parse(roomsData);
}

module.exports = {
  

    connect: function(io,PORT){
        io.on('connection', (socket) => {
            console.log('A user connected');


 
            function sendUpdatedRoomList() {
              Room.find()
                .then((updatedRooms) => {
                  io.emit('updatedRoomList', updatedRooms);
                  console.log('Updated room list sent:', JSON.stringify(updatedRooms));
                })
                .catch((err) => {
                  console.error('Error fetching rooms:', err);
                });
            }
            
            socket.on('roomlist', async () => {
              try {
                const rooms2 = await Room.find({});
                socket.emit('roomlist', JSON.stringify(rooms2));
              } catch (err) {
                console.error('Error fetching rooms:', err);
              }
            });
          

              socket.on('createRoom', (roomName) => {
                // Tìm phòng đã tồn tại trong MongoDB dựa trên tên
                Room.findOne({ name: roomName })
                  .then((existingRoom) => {
                    if (existingRoom) {
                      socket.emit('roomCreationError', 'Room with the same name already exists.');
                    } else {
                      // Tạo một phòng mới trong MongoDB với trường id được tính toán
                      Room.find().sort('-id').limit(1).exec()
                        .then((lastRoom) => {
                          const newId = lastRoom[0] ? lastRoom[0].id + 1 : 1;
              
                          Room.create({
                            id: newId,
                            name: roomName,
                            channels: [],
                            users: [],
                          })
                          .then((newRoom) => {
                            io.emit('roomCreated', newRoom);
              
                            // Sau khi tạo phòng thành công, bạn cũng có thể cập nhật danh sách phòng
                            // bằng cách lấy tất cả phòng từ MongoDB và gửi chúng cho tất cả các kết nối.
                            Room.find({})
                              .then((rooms) => {
                                io.emit('updatedRoomList', rooms);
                              })
                              .catch((error) => {
                                console.error('Error fetching rooms:', error);
                              });
              
                            console.log(`Room "${newRoom.name}" created with id ${newRoom.id}.`);
                          })
                          .catch((error) => {
                            console.error('Error creating room:', error);
                            socket.emit('roomCreationError', 'Error creating room.');
                          });
                        })
                        .catch((error) => {
                          console.error('Error getting last room id:', error);
                        });
                    }
                  })
                  .catch((error) => {
                    console.error('Error checking for existing room:', error);
                    socket.emit('roomCreationError', 'Error checking for existing room.');
                  });
              });
              


              socket.on('joinRoom', async ({ roomId, userId }) => {
                try {
                  // Tìm phòng trong MongoDB dựa trên `roomId`
                  const room = await Room.findOne({ id: roomId });
              
                  if (room) {
                    if (!room.users.includes(userId)) {
                      room.users.push(userId);
                      io.to(roomId).emit('userJoined', userId);
              
                      // Cập nhật thông tin phòng trong MongoDB
                      await room.save();
                      socket.join(roomId); // Tham gia phòng với roomId
                      
              
                      socket.emit('joinRoomSuccess', room);
                    } else {
                      socket.emit('joinRoomError', 'User is already in this room.');
                    }
                  } else {
                    socket.emit('joinRoomError', 'Room does not exist.');
                  }
                } catch (error) {
                  console.error('Error joining room:', error);
                  socket.emit('joinRoomError', 'Error joining room.');
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
                    // Tìm người dùng có ID lớn nhất trong cơ sở dữ liệu
                    const userWithMaxID = await User.findOne({}, {}, { sort: { id: -1 } });
                  
                    let newUserID = 1; // Giá trị mặc định nếu không có người dùng nào trong cơ sở dữ liệu
                    if (userWithMaxID) {
                      newUserID = userWithMaxID.id + 1;
                    }
              
                    // Thiết lập ID cho người dùng mới
                    newUser.id = newUserID;
              
                    // Thêm người dùng mới vào MongoDB
                    const createdUser = await User.create(newUser);
              
                    io.emit('userAdded', createdUser);
                    console.log(`User "${createdUser.username}" added with ID ${newUserID}.`);
                  }
                } catch (error) {
                  console.error(error);
                  socket.emit('userCreationError', 'Error creating user.');
                }
              });
              
              socket.on('addUserToRoom', async ({ userId, roomId }) => {
                try {
                  // Tìm phòng trong MongoDB dựa trên `roomId`
                  const room = await Room.findOne({ id: roomId });
              
                  if (room) {
                    if (!room.users.includes(userId)) {
                      room.users.push(userId);
              
                      // Cập nhật thông tin phòng trong MongoDB
                      await room.save();
                      io.to(roomId).emit('userAddedToRoom', { userId, roomId });
                    } else {
                      socket.emit('userAddToRoomError', 'User is already in this room.');
                    }
                  } else {
                    socket.emit('userAddToRoomError', 'Room does not exist.');
                  }
                } catch (error) {
                  console.error('Error adding user to room:', error);
                  socket.emit('userAddToRoomError', 'Error adding user to room.');
                }
              });
              

              
              // socket.on('addChannelToRoom', (data) => {
              //   const { channelName, roomId } = data;
              
              //   const room = rooms.find((room) => room.id === roomId);
              //   if (room) {
              //     const newChannel = {
              //       name: channelName,
              //     };
              
              //     room.channels.push(newChannel);
              
              //     io.to(roomId).emit('channelCreated', newChannel);
              //     sendUpdatedRoomList();
              
              //     // Cập nhật thông tin phòng trong mảng `rooms`
              //     const roomIndex = rooms.findIndex((r) => r.id === roomId);
              //     if (roomIndex !== -1) {
              //       rooms[roomIndex] = room;
              
              //       // Ghi dữ liệu phòng vào tệp JSON
              //       fs.writeFileSync(roomsDataFilePath, JSON.stringify(rooms), 'utf8');
              //     }
              //   } else {
              //     socket.emit('channelCreationError', 'Room does not exist.');
              //   }
              // });
              socket.on('addChannelToRoom', async (data) => {
                const { channelName, roomId } = data;
              
                try {
                  // Tìm phòng trong MongoDB dựa trên `roomId`
                  const room = await Room.findOne({ id: roomId });
              
                  if (room) {
                    const newChannel = {
                      name: channelName,
                    };
              
                    // Thêm kênh mới vào danh sách kênh của phòng trong MongoDB
                    room.channels.push(newChannel);
              
                    // Lưu thông tin phòng đã được cập nhật
                    await room.save();
              
                    io.to(roomId).emit('channelCreated', newChannel);
                    sendUpdatedRoomList();
                    console.log(`Channel "${newChannel.name}" created in room "${room.name}".`);
                  } else {
                    socket.emit('channelCreationError', 'Room does not exist.');
                  }
                } catch (error) {
                  console.error('Error creating channel:', error);
                  socket.emit('channelCreationError', 'Error creating channel.');
                }
              });
               
              socket.on('leaveRoom', async (roomId, userId) => {
                try {
                  // Tìm phòng trong MongoDB dựa trên `roomId`
                  const room = await Room.findOne({ id: roomId });
              
                  if (room) {
                    const userIndex = room.users.indexOf(userId);
                    if (userIndex !== -1) {
                      room.users.splice(userIndex, 1);
                      io.to(roomId).emit('userLeft', userId);
              
                      // Lưu thông tin phòng sau khi người dùng rời phòng
                      await room.save();
                      socket.emit('leaveRoomSuccess', room);
                    } else {
                      socket.emit('leaveRoomError', 'You are not in this room.');
                    }
                  } else {
                    socket.emit('leaveRoomError', 'Room does not exist.');
                  }
                } catch (error) {
                  console.error('Error leaving room:', error);
                  socket.emit('leaveRoomError', 'Error leaving room.');
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
              

 


socket.on('deleteRoom', async (roomId) => {
  try {
    // Tìm phòng trong MongoDB dựa trên `roomId` và xóa nó
    const deletedRoom = await Room.findOneAndRemove({ id: roomId });

    if (deletedRoom) {
      io.emit('roomDeleted', roomId);
      sendUpdatedRoomList();
      console.log(`Room "${deletedRoom.name}" deleted.`);
    } else {
      socket.emit('roomDeleteError', 'Room not found.');
    }
  } catch (error) {
    console.error('Error deleting room:', error);
    socket.emit('roomDeleteError', 'Error deleting room.');
  }
});


socket.on('getUsersInRoom', async (roomId) => {
  try {
    // Lấy danh sách ID người dùng từ phòng với id tương ứng
    const room = await Room.findById(roomId).exec();
    if (room) {
      const userIds = room.users;
      // Lấy danh sách người dùng từ các ID
      const usersInRoom = await User.find({ _id: { $in: userIds } }).exec();
      socket.emit('usersInRoom', usersInRoom);
    } else {
      socket.emit('usersInRoomError', 'Room not found.');
    }
  } catch (error) {
    socket.emit('usersInRoomError', 'Error fetching users in room.');
  }
});


          
// socket.on('message', ({ roomId, userId, text }) => {
//   if (rooms[roomId]) {
//     const message = { userId, text };
//     rooms[roomId].messages.push(message);

//     // Gửi tin nhắn đến tất cả người dùng trong phòng
//     io.to(roomId).emit('message', message);
//   }
// });
const roomMessages = {};

// socket.on('messageforroom', ({ roomId, userId, username, text }) => {
//   try {
//     // Tìm phòng trong MongoDB dựa trên `roomId`
//     Room.findOne({ id: roomId }, (err, room) => {
//       if (err) {
//         console.error('Error sending message:', err);
//       } else if (room) {
//         const message = { userId, username, text };
//         room.messages.push(message);
//         console.log(message);
//         // Lưu tin nhắn vào MongoDB (tùy bạn)
//         room.save((saveErr, savedRoom) => {
//           if (saveErr) {
//             console.error('Error saving message:', saveErr);
//           } else {
//             // Gửi tin nhắn đến tất cả người dùng trong phòng
//             io.to(roomId).emit('messageforroom', message);
//             console.log(message);
//           }
//         });

//         // Lưu tin nhắn trong biến `roomMessages`
//         if (!roomMessages[roomId]) {
//           roomMessages[roomId] = [];
//         }
//         roomMessages[roomId].push(message);
//       }
//     });
//   } catch (error) {
//     console.error('Error sending message:', error);
//   }
// });
socket.on('messageforroom', async ({ roomId, userId, username, text }) => {
  try {
    // Tìm phòng trong MongoDB dựa trên `roomId`
    const room = await Room.findOne({ id: roomId }).exec();
    if (room) {
      const message = { roomId,userId, username, text };
      
      room.messages.push(message);
     

      // Lưu tin nhắn vào MongoDB (tùy bạn)
      const savedRoom = await room.save();

      // Gửi tin nhắn đến tất cả người dùng trong phòng
      io.emit('messageforroom', message);
      console.log(message);
    } else {
      console.error('Room not found');
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
});


socket.on('message', ({ userId, username,text }) => {
  const message = { userId, username,text };
  // Lưu tin nhắn vào mảng hoặc cơ sở dữ liệu tùy theo ứng dụng của bạn
  // messages.push(message);
  
  // Gửi tin nhắn đến tất cả người dùng kết nối
  io.emit('message', message);
  console.log(message);
});

            socket.on('disconnect', () => {
              console.log(`Client disconnected: ${socket.id}`);
        
              // Loại bỏ người dùng ra khỏi tất cả các phòng mà họ tham gia
              for (const roomId in rooms) {
                const users = rooms[roomId].users;
                const index = users.findIndex((user) => user.socketId === socket.id);
                if (index !== -1) {
                  users.splice(index, 1);
                }
              }
            });





            // socket.on('messageforroom', ({ roomId, userId, username, text }) => {
            //   try {
            //     // Tìm phòng trong MongoDB dựa trên `roomId`
            //     const room = Room.findOne({ id: roomId });
            
            //     if (room) {
            //       const message = { userId, username, text };
            //       room.messages.push(message);
            
            //       // Lưu tin nhắn vào MongoDB (tùy bạn)
            //       room.save();
            
            //       // Gửi tin nhắn đến tất cả người dùng trong phòng
            //       io.to(roomId).emit('messageforroom', message);
            //     }
            //   } catch (error) {
            //     console.error('Error sending message:', error);
            //   }
            // });
            // socket.on('messageforroom', ({ roomId, userId, username, text }) => {
            //   try {
            //     // Tìm phòng trong MongoDB dựa trên `roomId`
            //     Room.findOne({ id: roomId }, (err, room) => {
            //       if (err) {
            //         console.error('Error sending message:', err);
            //       } else if (room) {
            //         const message = { userId, username, text };
            //         room.messages.push(message);
            //         // Lưu tin nhắn vào MongoDB (tùy bạn)
            //         room.save((saveErr, savedRoom) => {
            //           if (saveErr) {
            //             console.error('Error saving message:', saveErr);
            //           } else {
            //             // Gửi tin nhắn đến tất cả người dùng trong phòng
            //             io.to(roomId).emit('messageforroom', message);
            //           }
            //         });
            //       }
            //     });
            //   } catch (error) {
            //     console.error('Error sending message:', error);
            //   }
            // });
            // Tạo một đối tượng để lưu trữ tin nhắn của từng phòng

// Cập nhật lại code cho phần khác tương tự
const privateChatRooms = {}; // Lưu trữ phòng chat riêng tư

// Khi người dùng mở hộp chat riêng tư
socket.on('open-private-chat', (userId) => {
    const roomName = `private-${userId}`;
    if (!privateChatRooms[roomName]) {
        privateChatRooms[roomName] = [];
    }
    socket.join(roomName);
});

// Khi người dùng gửi tin nhắn riêng tư
// socket.on('send-private-message', (data) => {
//     const { userId, message } = data;
//     const roomName = `private-${userId}`;
//     // privateChatRooms[roomName].push(message);
//     console.log(message);
//     io.to(roomName).emit(`private-message-${userId}`, message);
// });
socket.on('send-private-message', (data) => {
  const { sendername, receiverId, message } = data;
  const roomName = `private-${receiverId}`;
  
  // Tạo một đối tượng chứa thông tin tin nhắn
  const privateMessage = {
    sendername: sendername,
    message: message,
    receiverId: receiverId
  };
  
  console.log(privateMessage);
  
  // Bây giờ, hãy gửi đối tượng tin nhắn chứa thông tin người gửi
  io.to(roomName).emit(`private-message-${receiverId}`, privateMessage);
});



            
          
            
          
            // socket.on('disconnect', () => {
            //   console.log('A user disconnected');
            // });
            
          });
    }
}