const fs = require('fs');
const path = require('path');
const userDataFilePath = path.join(__dirname, '../data/users.json');
const userData = JSON.parse(fs.readFileSync(userDataFilePath, 'utf8'));
module.exports = {
  

    connect: function(io,PORT){
      const rooms = [
        { id: 1, name: 'Room 1', channels: [], users: [] },
        { id: 2, name: 'Room 2', channels: [], users: [] },
        { id: 3, name: 'Room 3', channels: [], users: [] },
      ];
  
        io.on('connection', (socket) => {
            console.log('A user connected');
            function sendUpdatedRoomList() {
                io.emit('updatedRoomList', rooms);
                console.log("this is the testing",JSON.stringify(rooms))
              }
            socket.on('createRoom', (roomName) => {
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
              });
              socket.on('createChannel', (data) => {
                const { channelName, roomId } = data;
        
               
                const newChannel = {
                  name: channelName,
                
                };
        
              
                const room = rooms.find((room) => room.id === roomId);
                if (room) {
                  room.channels.push(newChannel);
                  io.to(roomId).emit('channelCreated', newChannel);
                  sendUpdatedRoomList();
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
              
                userData.people.push(newUser);
                
                
                fs.writeFileSync(userDataFilePath, JSON.stringify(userData), 'utf8');

                
                io.emit('userAdded', newUser);

                console.log(`User "${newUser.username}" added.`);
                console.log(userData);
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