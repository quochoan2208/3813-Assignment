module.exports = {

    connect: function(io,PORT){
        var rooms=["room1","room2","room3","room4"];
        io.on('connection', (socket) => {
            console.log('A user connected');
            function sendUpdatedRoomList() {
                io.emit('updatedRoomList', JSON.stringify(rooms));
                console.log("this is the testing",JSON.stringify(rooms))
              }
            socket.on('createRoom', (roomName) => {
                
            
                // Thêm phòng vào danh sách
                rooms.push(roomName);
               
            
                // Gửi thông báo về việc thêm phòng thành công
                io.emit('roomCreated', roomName);
                sendUpdatedRoomList();
            
                console.log(`Room "${roomName}" created.`);
                console.log(rooms);
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