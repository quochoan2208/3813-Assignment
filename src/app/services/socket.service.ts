import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {io} from 'socket.io-client';
const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private roomDeletedSubject = new Subject<string>();

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
