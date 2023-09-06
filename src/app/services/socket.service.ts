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
  constructor() {
    // Kết nối đến máy chủ Socket.io ở đây
    this.socket = io(SERVER_URL);
    this.socket.on('updatedRoomList', (updatedRoomList:any) => {
      this.rooms = JSON.parse(updatedRoomList);
      this.roomListSubject.next(this.rooms);
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
  
  
  
}
