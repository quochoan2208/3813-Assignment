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
    roomLeftSubject: any;
    constructor(private http: HttpClient) {
      

      //listen on port localhost:3000
      this.socket = io(SERVER_URL);

 // Listen for an updated room list from the server
      this.socket.on('updatedRoomList', (data: any) => {
        this.roomsWithChannels = data;
        this.roomListSubject.next(data);
      });

    }
    
  // Send a request for the room list
    reqroomList(){
      this.socket.emit('roomlist','list please');
    }
 // Get the room list from the server
    getroomList(next:any){
      this.socket.on('roomlist',(res: any)=>next(res));

    }
      // Join a room with a specific roomId and userId
    joinRoom(roomId: string, userId: number) {
      this.socket.emit('joinRoom', { roomId, userId });
    }
      // Create a private chat between senderId and receiverId
    createPrivateChat(senderId: number, receiverId: number) {
      this.socket.emit('privateMessage', { senderId, receiverId });
    }
    
 // Observable for room join success or error
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
      // Add a user to a room
    addUserToRoom(userId: number, roomId: number) {
    
      this.socket.emit('addUserToRoom', { userId, roomId });
    }
     // Leave a room
    leaveRoom(roomId: any, userId: number) {
      this.socket.emit('leaveRoom', roomId, userId);
    }
    // Observable for room leave success or error
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
 // Add a new user
    addUser(newUser: User) {
      this.socket.emit('addUser', newUser); 
    }
    // Delete a user
    deleteUser(userId: number) {
      
      this.socket.emit('deleteUser', userId);
    }
    // Observable for user deletion
    userDeleted() {
      
      return new Observable<number>((observer) => {
        this.socket.on('userDeleted', (deletedUserId: number) => {
          observer.next(deletedUserId);
        });
      });
    }
     // Observable for user deletion error
    userDeleteError() {
    
      return new Observable<string>((observer) => {
        this.socket.on('userDeleteError', (error: string) => {
          observer.next(error);
        });
      });

      
    }
     // Get a list of users
    getUsersList(): Observable<any[]> {
      return new Observable<any[]>((observer) => {
        this.socket.emit('getUsersList');
        this.socket.on('usersList', (data: any[]) => {
          observer.next(data);
        });
      });
    }
  
// Open a private chat with a user
openPrivateChat(userId: number) {
  this.selectedUserIdSubject.next(userId);
  this.socket.emit('open-private-chat', userId);
}

// Send message to an individual person
sendPrivateMessage(sendername: string,receiverId: number, message: string) {
  this.socket.emit('send-private-message', { sendername: sendername,receiverId: receiverId, message });
}
// Observable for receiving private messages
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
// Update the avatar for a user
public updateAvatar(userId: number, safeImageUrl: any) {
  this.socket.emit('updateAvatar', { userId, safeImageUrl });
}



  // Send a message
    sendMessage(userId: number, username: string, text: string, image: any): void {
      this.socket.emit('message', { userId, username, text, image });
    }
    
    // Listen for server events
    on(event: string): Observable<any> {
      return new Observable<any>((observer) => {
        this.socket.on(event, (data: any) => {
          observer.next(data);
        });
      });
    }
    // Create a room
    createRoom(room: string) {

      this.socket.emit('createRoom', room);
    }
    // Send a message to a room
    sendMessageToRoom(roomId: number, userId: number, username: string, message: string): void {
      this.socket.emit('messageforroom', { roomId, userId, username, text: message });
    }
    

 // Get the room list as an observable
    getRoomList(): Observable<any> {
      return this.roomListSubject.asObservable();
    }
     // Delete a room
    deleteRoom(roomId: string) {
    
      this.socket.emit('deleteRoom', roomId);

      this.roomDeletedSubject.next(roomId);
    }
    // Observable for room deletion
    roomDeleted(): Observable<string> {
      return this.roomDeletedSubject.asObservable();
    }
     // Create a channel
    createChannel(channelName: string, roomId: string) {
  
      this.socket.emit('createChannel', { channelName, roomId });
    }
     // Add a channel to a room
    addChannelToRoom(channelName: string, roomId: string) {
      this.socket.emit('addChannelToRoom', { channelName, roomId });
    }
    // Create a channel in a room
    createChannelInRoom(channelName: string, roomId: string) {
      this.socket.emit('createChannel', { channelName, roomId });
    }
    // Add a user to a channel
    addUserToChannel(channelName: string, roomId: string, userId: number) {
      this.socket.emit('addUserToChannel', { channelName, roomId, userId });
    }

     // Get the list of users in a room
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
