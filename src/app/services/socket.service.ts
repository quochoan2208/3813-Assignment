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
    // Kết nối đến máy chủ Socket.io ở đây
    this.socket = io(SERVER_URL);
    this.socket.on('updatedRoomList', (data: any) => {
      this.roomsWithChannels = data;
      this.roomListSubject.next(data);
    });

  }

  joinRoom(roomId: string) {
    this.socket.emit('joinRoom', roomId); // Gửi yêu cầu tham gia phòng đến máy chủ
  }
  
  roomJoined(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('joinRoomSuccess', (room: any) => {
        observer.next({ success: true, room }); // Lắng nghe thông báo tham gia phòng thành công
      });
  
      this.socket.on('joinRoomError', (error: any) => {
        observer.next({ success: false, error });// Lắng nghe thông báo lỗi khi tham gia phòng
      });
    });
  }
  leaveRoom(roomId: string) {
    this.socket.emit('leaveRoom', roomId);
  }
  roomLeft(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('leaveRoomSuccess', (room: any) => {
        observer.next({ success: true, room }); // Lắng nghe thông báo rời phòng thành công
      });
  
      this.socket.on('leaveRoomError', (error: any) => {
        observer.next({ success: false, error }); // Lắng nghe thông báo lỗi khi rời phòng
      });
    });
  }
 // Trong file socket.service.ts
  addUser(newUser: User) {
    this.socket.emit('addUser', newUser); // Gửi yêu cầu thêm người dùng mới đến máy chủ
  }
  deleteUser(userId: number) {
    // Gửi yêu cầu xóa người dùng đến máy chủ thông qua socket
    this.socket.emit('deleteUser', userId);
  }
  userDeleted() {
    // Lắng nghe sự kiện khi người dùng đã bị xóa thành công và trả về sự kiện đó dưới dạng Observable
    return new Observable<number>((observer) => {
      this.socket.on('userDeleted', (deletedUserId: number) => {
        observer.next(deletedUserId);
      });
    });
  }
  userDeleteError() {
    // Lắng nghe sự kiện khi xóa người dùng thất bại và trả về sự kiện đó dưới dạng Observable
    return new Observable<string>((observer) => {
      this.socket.on('userDeleteError', (error: string) => {
        observer.next(error);
      });
    });

    
  }
  getUsersList(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      // Gửi yêu cầu lấy danh sách người dùng đến máy chủ socket
      this.socket.emit('getUsersList');

      // Lắng nghe sự kiện khi máy chủ socket trả về danh sách người dùng
      this.socket.on('usersList', (data: any[]) => {
        observer.next(data);
      });
    });
  }
  
  

  
  

  

  // Thêm các phương thức để gửi và lắng nghe sự kiện Socket.io
  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  receiveMessage(callback: (message: string) => void) {
    this.socket.on('message', callback);
  }
  createRoom(room: string) {
    // Gửi yêu cầu thêm phòng mới đến máy chủ
    this.socket.emit('createRoom', room);
  }

  getRoomList(): Observable<any> {
    return this.roomListSubject.asObservable();
  }
  deleteRoom(roomId: string) {
    // Gửi yêu cầu xóa phòng đến máy chủ
    this.socket.emit('deleteRoom', roomId);
    
    // Khi yêu cầu xóa phòng đã được gửi đi thành công, phản hồi lại sự kiện 'roomDeleted' với roomId
    this.roomDeletedSubject.next(roomId);
  }
  roomDeleted(): Observable<string> {
    return this.roomDeletedSubject.asObservable();
  }
  createChannel(channelName: string, roomId: string) {
    // Gửi yêu cầu tạo kênh mới đến máy chủ
    this.socket.emit('createChannel', { channelName, roomId });
  }

  
  
  
}
