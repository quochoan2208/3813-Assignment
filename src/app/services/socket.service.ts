  import { Injectable } from '@angular/core';
  import { Observable, Subject, BehaviorSubject } from 'rxjs';
  import {io} from 'socket.io-client';
  const SERVER_URL = 'http://localhost:3000';
  import { User } from '../user';
  import { HttpClient } from '@angular/common/http';

  @Injectable({
    providedIn: 'root'
  })
  export class SocketService {
    private roomDeletedSubject = new Subject<string>();
    newuser:User = new User();

    private socket: any ;
    rooms: any;
    private roomListSubject = new Subject<any>();
    roomsWithChannels: any[] = [];
    roomMessages: { [roomId: string]: any[] } = {};
    private selectedUserId: number | null | undefined;
    private selectedUserIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
    constructor(private http: HttpClient) {
      
      // this.selectedUserId = null;
      
      this.socket = io(SERVER_URL);
      // this.socket.on('messageforroom', (message: any) => {
      //   const roomId = message.roomId;
      //   if (!this.roomMessages[roomId]) {
      //     this.roomMessages[roomId] = [];
      //   }
      //   this.roomMessages[roomId].push(message);
      // });

      this.socket.on('updatedRoomList', (data: any) => {
        this.roomsWithChannels = data;
        this.roomListSubject.next(data);
      });

    }
    reqroomList(){
      this.socket.emit('roomlist','list please');
    }

    getroomList(next:any){
      this.socket.on('roomlist',(res: any)=>next(res));

    }

    joinRoom(roomId: string, userId: number) {
      this.socket.emit('joinRoom', { roomId, userId });
    }
    createPrivateChat(senderId: number, receiverId: number) {
      this.socket.emit('privateMessage', { senderId, receiverId });
    }
    

    roomJoined(): Observable<any> {
      return new Observable((observer) => {
        this.socket.on('joinRoomSuccess', (room: any) => {
          observer.next({ success: true, room });
        });
    
        this.socket.on('joinRoomError', (error: any) => {
          observer.next({ success: false, error });
        });
      });
    }
    addUserToRoom(userId: number, roomId: number) {
    
      this.socket.emit('addUserToRoom', { userId, roomId });
    }
    
    leaveRoom(roomId: string, userId: number) {
      this.socket.emit('leaveRoom', roomId, userId);
    }
    
    roomLeft(): Observable<any> {
      return new Observable((observer) => {
        this.socket.on('leaveRoomSuccess', (room: any) => {
          observer.next({ success: true, room }); 
        });
    
        this.socket.on('leaveRoomError', (error: any) => {
          observer.next({ success: false, error });
        });
      });
    }

    addUser(newUser: User) {
      this.socket.emit('addUser', newUser); 
    }
    deleteUser(userId: number) {
      
      this.socket.emit('deleteUser', userId);
    }
    userDeleted() {
      
      return new Observable<number>((observer) => {
        this.socket.on('userDeleted', (deletedUserId: number) => {
          observer.next(deletedUserId);
        });
      });
    }
    userDeleteError() {
    
      return new Observable<string>((observer) => {
        this.socket.on('userDeleteError', (error: string) => {
          observer.next(error);
        });
      });

      
    }
    getUsersList(): Observable<any[]> {
      return new Observable<any[]>((observer) => {
        this.socket.emit('getUsersList');
        this.socket.on('usersList', (data: any[]) => {
          observer.next(data);
        });
      });
    }
  

    // sendMessage(message: string) {
    //   this.socket.emit('message', message);
    // }

    // receiveMessage(callback: (message: string) => void) {
    //   this.socket.on('message', callback);
    // }

    // Khi người dùng mở hộp chat riêng tư
// openPrivateChat(userId: number) {
//   this.socket.emit('open-private-chat', userId);
//   this.selectedUserId = userId;
//   console.log(userId + "" + this.selectedUserId)
// }
openPrivateChat(userId: number) {
  this.selectedUserIdSubject.next(userId);
  this.socket.emit('open-private-chat', userId);
}

// Gửi tin nhắn riêng tư cho một người dùng cụ thể
sendPrivateMessage(sendername: string,receiverId: number, message: string) {
  this.socket.emit('send-private-message', { sendername: sendername,receiverId: receiverId, message });
}
onPrivateMessage(): Observable<string> {
  return new Observable<string>((observer) => {
    console.log("da duoc goi")
    this.selectedUserIdSubject.subscribe((selectedUserId) => {
      if (selectedUserId !== null) {
        this.socket.on(`private-message-${selectedUserId}`, (message: string) => {
          observer.next(message);

        });
      }
    });
  });
}
public updateAvatar(userId: number, safeImageUrl: any) {
  this.socket.emit('updateAvatar', { userId, safeImageUrl });
}


// public uploadAvatar(userId: string, file: File) {
//   const formData = new FormData();
//   formData.append('avatar', file);
//   formData.append('userId', userId);

//   return this.http.post('/upload-avatar', formData);
// }

// Nghe sự kiện tin nhắn riêng tư
// onPrivateMessage(): Observable<string> {
//   return new Observable<string>((observer) => {
//       this.socket.on(`private-message-${this.selectedUserId}}`, (message: string) => {
//           observer.next(message);
//           console.log(this.selectedUserId)
//       });
//   });
// }

    // sendPrivateMessage(receiverId: number, messageText: string) {
    //   this.socket.emit('privateMessage', { receiverId, message: messageText });
    // }
    
    sendMessage(userId: number,  username: string,text: string,): void {
      this.socket.emit('message', { userId, username,text });
    }
    // Phương thức để lắng nghe sự kiện từ máy chủ
    on(event: string): Observable<any> {
      return new Observable<any>((observer) => {
        this.socket.on(event, (data: any) => {
          observer.next(data);
        });
      });
    }
    createRoom(room: string) {

      this.socket.emit('createRoom', room);
    }
    sendMessageToRoom(roomId: number, userId: number, username: string, message: string): void {
      this.socket.emit('messageforroom', { roomId, userId, username, text: message });
    }
    


    getRoomList(): Observable<any> {
      return this.roomListSubject.asObservable();
    }
    deleteRoom(roomId: string) {
    
      this.socket.emit('deleteRoom', roomId);

      this.roomDeletedSubject.next(roomId);
    }
    roomDeleted(): Observable<string> {
      return this.roomDeletedSubject.asObservable();
    }
    createChannel(channelName: string, roomId: string) {
  
      this.socket.emit('createChannel', { channelName, roomId });
    }
    addChannelToRoom(channelName: string, roomId: string) {
      this.socket.emit('addChannelToRoom', { channelName, roomId });
    }
    createChannelInRoom(channelName: string, roomId: string) {
      this.socket.emit('createChannel', { channelName, roomId });
    }
    addUserToChannel(channelName: string, roomId: string, userId: number) {
      this.socket.emit('addUserToChannel', { channelName, roomId, userId });
    }
    // getUsersInRoom(roomId: string): Promise<any> {
    //   return new Promise((resolve, reject) => {
    //     this.socket.emit('getUsersInRoom', roomId);
    
    //     this.socket.on('usersInRoom', (users: any) => {
    //       resolve(users);
    //     });
    
    //     this.socket.on('usersInRoomError', (error: string) => {
    //       reject(error);
    //     });
    //   });
    // }
    
  getUsersInRoom(roomId: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('getUsersInRoom', roomId);

      this.socket.on('usersInRoom', (users: any) => {
        observer.next(users);
        observer.complete();
      });

      this.socket.on('usersInRoomError', (error: string) => {
        observer.error(error);
      });
    });
  }
  
    
    

    
    
    
  }
