module.exports = {

    connect: function(io,PORT){
      const rooms = [
        { id: '1', name: 'Room 1', channels: [] },
        { id: '2', name: 'Room 2', channels: [] },
        { id: '3', name: 'Room 3', channels: [] },
      ];
  
        io.on('connection', (socket) => {
            console.log('A user connected');
            function sendUpdatedRoomList() {
                io.emit('updatedRoomList', JSON.stringify(rooms));
                console.log("this is the testing",JSON.stringify(rooms))
              }
            socket.on('createRoom', (roomName) => {
              const newRoom = {
                id: rooms.length +1,
                name: roomName,
                channels: [],
              }
                
            
                // Thêm phòng vào danh sách
                rooms.push(newRoom);
               
            
                // Gửi thông báo về việc thêm phòng thành công
                io.emit('roomCreated', newRoom);
                sendUpdatedRoomList();
            
                console.log(`Room "${newRoom}" created.`);
                console.log(rooms);
              });

              socket.on('deleteRoom', (roomId) => {
                // Xóa phòng dựa vào roomId
                const index = rooms.findIndex((room) => room.id === roomId);
                if (index !== -1) {
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