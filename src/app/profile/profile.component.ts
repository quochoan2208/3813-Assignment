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
  newUsername: string = "";
  newEmail: string ="";
  newPassword: string ="";
  users: any[] = [];
  index = this.users.length + 1;
  
  private authService = inject(AuthService);
  selectedfile:any = null;
  imagepath:String ="";
  currentuser:User = new User();
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
  // Trong Angular component


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
  deleteUser(userId: number) {
    this.socketService.deleteUser(userId);
  }
  

  createUser() {
    
    // Kiểm tra xem các trường thông tin người dùng có được điền đầy đủ không
    if (this.newUsername && this.newEmail && this.newPassword) {
      // Tạo một đối tượng người dùng mới từ thông tin đã nhập
      const newUser = {
        username: this.newUsername,
        email: this.newEmail,
        pwd: this.newPassword,
        valid: true, // Đây là một giá trị mặc định, bạn có thể thay đổi nếu cần
        avatar: '', // Đây là một giá trị mặc định, bạn có thể thay đổi nếu cần
        role: 'USER',
        id: this.index // Đây là một giá trị mặc định, bạn có thể thay đổi nếu cần
      };
      this.index++;
      

      // Gọi phương thức từ socketService để tạo người dùng mới và gửi dữ liệu lên máy chủ
      this.socketService.addUser(newUser);

      // Sau khi gửi yêu cầu tạo người dùng, bạn có thể thực hiện các hành động khác ở đây (ví dụ: hiển thị thông báo, làm mới trang, vv.)
    } else {
      // Xử lý trường hợp người dùng chưa điền đầy đủ thông tin
      console.error('Please fill in all fields.');
      // Hiển thị thông báo lỗi hoặc thực hiện các hành động khác ở đây
    }
  }
 



  ngOnInit(){
    this.currentuser = JSON.parse(this.authService.getCurrentuser() || '{}');
    console.log(this.currentuser);
    this.socketService.userDeleted().subscribe((deletedUserId: number) => {
      console.log(`User with ID ${deletedUserId} has been deleted.`);
      // Cập nhật lại danh sách người dùng nếu cần
    });
    this.socketService.getUsersList().subscribe((userList: any[]) => {
      this.users = userList;
    });

  
  
    this.socketService.userDeleteError().subscribe((error: string) => {
      console.error(`Failed to delete user: ${error}`);
      // Hiển thị thông báo lỗi cho người dùng nếu cần
    });
   
    this.socketService.getRoomList().subscribe((data) => {
      console.log('Updated room list:', data);
      this.rooms = data;
    });
    
    
  }


   
    
  }

  






