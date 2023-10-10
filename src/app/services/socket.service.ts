import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {io} from 'socket.io-client';
const SERVER_URL = 'http://localhost:3000';
import { User } from '../user';

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
  constructor() {
    
    this.socket = io(SERVER_URL);
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
  
  

  
  

  

  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  receiveMessage(callback: (message: string) => void) {
    this.socket.on('message', callback);
  }
  createRoom(room: string) {

    this.socket.emit('createRoom', room);
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
  
  

  
  
  
}
