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
                
            
                // Thêm phòng vào danh sách
                rooms.push(newRoom);
               
            
                // Gửi thông báo về việc thêm phòng thành công
                io.emit('roomCreated', newRoom);
                sendUpdatedRoomList();
            
                console.log(`Room "${newRoom}" created.`);
                console.log(rooms);
              });
              socket.on('createChannel', (data) => {
                const { channelName, roomId } = data;
        
                // Tạo kênh mới với thông tin tên và các thuộc tính khác
                const newChannel = {
                  name: channelName,
                 
                  // Các thông tin khác về kênh
                };
        
                // Tìm phòng theo roomId và thêm kênh vào phòng đó
                const room = rooms.find((room) => room.id === roomId);
                if (room) {
                  room.channels.push(newChannel);
                  io.to(roomId).emit('channelCreated', newChannel);
                  sendUpdatedRoomList();
                }
              });
              // Ở phía server, thêm một sự kiện để xử lý yêu cầu tham gia vào phòng
              // socket.on('joinRoom', (roomId) => {
              //   const room = rooms.find((room) => room.id === roomId);
              //   if (room) {
              //     if (!room.users.includes(socket.id)) {
              //       room.users.push(socket.id);
              //       io.to(roomId).emit('userJoined', socket.id);
              //       socket.emit('joinRoomSuccess', room);
              //     } else {
              //       socket.emit('joinRoomError', 'You are already in this room.');
              //     }
              //   } else {
              //     socket.emit('joinRoomError', 'Room does not exist.');
              //   }
              // });
              // Thêm vào phần xử lý yêu cầu tham gia phòng trong file socket.service.js
            socket.on('joinRoom', (roomId) => {
              const room = rooms.find((room) => room.id === roomId);
              if (room) {
                // Kiểm tra xem người dùng đã tham gia vào phòng này chưa
                if (!room.users.includes(socket.id)) {
                  // Thêm người dùng vào phòng
                  room.users.push(socket.id);
                  // Gửi thông báo cho tất cả người dùng trong phòng về việc tham gia của người dùng mới
                  io.to(roomId).emit('userJoined', socket.id);
                  // Gửi phản hồi cho người dùng
                  socket.emit('joinRoomSuccess', room); // Gửi thông tin phòng sau khi tham gia thành công
                } else {
                  // Người dùng đã tham gia vào phòng này trước đó
                  socket.emit('joinRoomError', 'You are already in this room.');
                }
              } else {
                // Phòng không tồn tại
                socket.emit('joinRoomError', 'Room does not exist.');
              }
            });

            


              socket.on('deleteRoom', (roomId) => {
                // Xóa phòng dựa vào roomId
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
              // Xử lý thông điệp và gửi lại (nếu cần) thông qua socket.emit() hoặc io.emit()
            });
            
          
            socket.on('disconnect', () => {
              console.log('A user disconnected');
            });
          });
    }
}