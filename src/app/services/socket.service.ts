import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {io} from 'socket.io-client';
const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

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
  // roomCreated(callback: (updatedRoomList: string) => void) {
  //   this.socket.on('updatedRoomList', (updatedRoomList: string) => {
  //     // Cập nhật danh sách phòng trên giao diện người dùng và gọi callback
  //     this.rooms = JSON.parse(updatedRoomList);
    
  //     callback(updatedRoomList);
  //   });
  // }
  getRoomList(): Observable<any> {
    return this.roomListSubject.asObservable();
  }
  
}
