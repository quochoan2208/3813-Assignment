import { Component ,inject,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import {User} from '../user';
import { SocketService } from '../services/socket.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  newRoomName: string = '';
  message: string ="";
  receivedMessages: string[] = [];
  roomToDelete: string = '';
  newChannelName: string = '';
  roomsWithChannels: any[] = [];
  selectedRoomId: string = '';

  rooms : any[] =  [
    { id: 1, name: 'Room 1', channels: [], users: [] },
    { id: 2, name: 'Room 2', channels: [], users: [] },
    { id: 3, name: 'Room 3', channels: [], users: [] },
  ];
  selectedRoomChannels: any;
  constructor(private socketService: SocketService){}
  sendMessage() {
    this.socketService.sendMessage(this.message);
  }
  selectRoom(roomId: string) {
    this.selectedRoomId = roomId;
    // Cập nhật danh sách kênh của phòng đang được chọn
    const selectedRoom = this.roomsWithChannels.find((room) => room.id === roomId);
    if (selectedRoom) {
      this.selectedRoomChannels = selectedRoom.channels;
    }
  }
  createChannelInSelectedRoom() {
    if (this.selectedRoomId && this.newChannelName) {
      this.socketService.createChannel(this.newChannelName, this.selectedRoomId);
    }
  }
  deleteSelectedRoom() {
    if (this.selectedRoomId) {
      this.socketService.deleteRoom(this.selectedRoomId);
      this.selectedRoomId = ''; // Đặt lại phòng đang được chọn sau khi xóa
    }
  }
  getSelectedRoomName(): string {
    const selectedRoom = this.roomsWithChannels.find((room) => room.id === this.selectedRoomId);
    return selectedRoom ? selectedRoom.name : 'No room selected';
  }
  
  createRoom(){
    this.socketService.createRoom(this.newRoomName);
    this.socketService.getRoomList().subscribe((data) => {
      this.roomsWithChannels = data;
    });
  }
  deleteRoom(roomId: string) {
    // Gọi phương thức xóa phòng từ SocketService
    this.socketService.deleteRoom(roomId);
    this.socketService.getRoomList().subscribe((data) => {
      this.roomsWithChannels = data;
    });
  }
  leaveRoom(roomId: string) {
    this.socketService.leaveRoom(roomId);
  
    this.socketService.roomLeft().subscribe((response: any) => {
      if (response.success) {
        // Rời phòng thành công
        console.log(`You have left room: ${response.room.name}`);
        // Hiển thị thông báo xác nhận cho người dùng
      } else {
        // Rời phòng thất bại
        console.error(`Failed to leave room: ${response.error}`);
        // Hiển thị thông báo lỗi cho người dùng
      }
    });
    this.socketService.getRoomList().subscribe((data) => {
      this.roomsWithChannels = data;
    });
    console.log(this.rooms)
  }
  joinRoom(roomId: string) {
    // Gửi yêu cầu tham gia vào phòng đến máy chủ
    if (roomId) {
      this.socketService.joinRoom(roomId);
      
      // Lắng nghe phản hồi từ máy chủ
      this.socketService.roomJoined().subscribe((response: any) => {
        if (response.success) {
          // Tham gia phòng thành công
          console.log(`You have joined room: ${response.room.name}`);
          // Hiển thị thông báo xác nhận cho người dùng
        } else {
          // Tham gia phòng thất bại
          console.error(`Failed to join room: ${response.error}`);
          // Hiển thị thông báo lỗi cho người dùng
        }
      });
    } else {
      console.error('Room ID is invalid.');
    }
    this.socketService.getRoomList().subscribe((data) => {
      this.roomsWithChannels = data;
    });
    console.log(this.rooms)
  }
  
  confirmDeleteRoom() {
    if (this.roomToDelete) {
      this.socketService.deleteRoom(this.roomToDelete);
      this.roomToDelete = ''; // Đặt lại biến để chọn phòng để xóa
    }
  }
  createChannel(roomId: string) {
    // Gọi phương thức tạo kênh từ SocketService
    this.socketService.createChannel(this.newChannelName, roomId);
  }

  
  
 


  private authService = inject(AuthService);
  selectedfile:any = null;
  imagepath:String ="";
  currentuser:User = new User();

  ngOnInit(){
    this.currentuser = JSON.parse(this.authService.getCurrentuser() || '{}');
    console.log(this.currentuser);
   
    this.socketService.getRoomList().subscribe((data) => {
      console.log('Updated room list:', data);
      this.rooms = data;
    });
    
    
  }


   
    
  }

  






