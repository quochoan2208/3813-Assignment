const fs = require('fs');
const path = require('path');
const userDataFilePath = path.join(__dirname, '../data/users.json');
const userData = JSON.parse(fs.readFileSync(userDataFilePath, 'utf8'));
module.exports = {
  

    connect: function(io,PORT){
      const rooms = [
        { id: 1, name: 'Room 1', channels: [{id: 1, name: 'Channel 2'},{id: 2, name: 'Channel 1'}], users: [] },
        { id: 2, name: 'Room 2', channels: [{id: 1, name: 'Channel 3'},{id: 2, name: 'Channel 4'}], users: [] },
        { id: 3, name: 'Room 3', channels: [], users: [] },
      ];
  
        io.on('connection', (socket) => {
            console.log('A user connected');
            function sendUpdatedRoomList() {
                io.emit('updatedRoomList', rooms);
                console.log("this is the testing",JSON.stringify(rooms))
              }
            socket.on('createRoom', (roomName) => {
              const existingRoom = rooms.find((room) => room.name === roomName);
              if (existingRoom) {
              
                socket.emit('roomCreationError', 'Room with the same name already exists.');
              } else {
              const newRoom = {
                id: rooms.length +1,
                name: roomName,
                channels: [],
                users: [],
              }
                
            
             
                rooms.push(newRoom);
               
            
            
                io.emit('roomCreated', newRoom);
                sendUpdatedRoomList();
            
                console.log(`Room "${newRoom}" created.`);
                console.log(rooms);
              }});
              socket.on('createChannel', (data) => {
                const { channelName, roomId } = data;
              
                const room = rooms.find((room) => room.id === roomId);
                if (room) {
                  const newChannel = {
                    id: room.channels.length + 1, 
                    name: channelName,
                  };
              
                  room.channels.push(newChannel);
              
                  io.to(roomId).emit('channelCreated', newChannel);
                  sendUpdatedRoomList();
                } else {
                  
                  socket.emit('channelCreationError', 'Room does not exist.');
                }
              });
              
            socket.on('joinRoom', (roomId) => {
              const room = rooms.find((room) => room.id === roomId);
              if (room) {
                
                if (!room.users.includes(socket.id)) {
                 
                  room.users.push(socket.id);
                  
                  io.to(roomId).emit('userJoined', socket.id);
                  
                  socket.emit('joinRoomSuccess', room); 
                } else {
                  
                  socket.emit('joinRoomError', 'You are already in this room.');
                }
              } else {
                
                socket.emit('joinRoomError', 'Room does not exist.');
              }
            });
            
              
              socket.on('addUser', (newUser) => {
                
                const existingUserByName = userData.people.find((user) => user.username === newUser.username);
              
                
                const existingUserByEmail = userData.people.find((user) => user.email === newUser.email);
              
                if (existingUserByName) {
                  
                  socket.emit('userCreationError', 'Username already exists.');
                } else if (existingUserByEmail) {
                  
                  socket.emit('userCreationError', 'Email already exists.');
                } else {
              
                  newUser.id = userData.people.length + 1
                  userData.people.push(newUser);
              
                  fs.writeFileSync(userDataFilePath, JSON.stringify(userData), 'utf8');
              
                  io.emit('userAdded', newUser);
              
                  console.log(`User "${newUser.username}" added.`);
                  console.log(userData);
                }
              });
              
              //Add User To Room
              socket.on('addUserToRoom', ({ userId, roomId }) => {
                const room = rooms.find((room) => room.id === roomId);
                if (room) {
                  if (!room.users.includes(userId)) {
                    room.users.push(userId);
                    io.to(roomId).emit('userAddedToRoom', { userId, roomId });
                  } else {
                    // Gửi thông báo lỗi nếu người dùng đã có trong phòng
                    socket.emit('userAddToRoomError', 'User is already in this room.');
                  }
                } else {
                  // Gửi thông báo lỗi nếu phòng không tồn tại
                  socket.emit('userAddToRoomError', 'Room does not exist.');
                }
              });
              // Trong file socket.js
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
                } else {
                  // Gửi thông báo lỗi nếu phòng không tồn tại
                  socket.emit('channelCreationError', 'Room does not exist.');
                }
              });

              

     
              socket.on('leaveRoom', (roomId) => {
                const room = rooms.find((room) => room.id === roomId);
                if (room) {
                  const userIndex = room.users.indexOf(socket.id);
                  if (userIndex !== -1) {
                    room.users.splice(userIndex, 1);
                    io.to(roomId).emit('userLeft', socket.id);
                    socket.emit('leaveRoomSuccess', room);
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
              socket.on('getUsersList', () => {
              
                const userList = userData.people;
            
               
                socket.emit('usersList', userList);
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
                    }}
                  rooms.splice(index, 1);
                  io.emit('roomDeleted', roomId);
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