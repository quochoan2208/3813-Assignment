import { Component ,inject,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import {User} from '../user';
import { SocketService } from '../services/socket.service';

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

  rooms : any[] = [
    { id: 1, name: 'Room 1' },
    { id: 2, name: 'Room 2' },
    { id: 3, name: 'Room 3' },
  ];
  constructor(private socketService: SocketService){}
  sendMessage() {
    this.socketService.sendMessage(this.message);
  }
  createRoom(){
    this.socketService.createRoom(this.newRoomName)
  }
  deleteRoom(roomId: string) {
    // Gọi phương thức xóa phòng từ SocketService
    this.socketService.deleteRoom(roomId);
  }
  confirmDeleteRoom() {
    if (this.roomToDelete) {
      this.socketService.deleteRoom(this.roomToDelete);
      this.roomToDelete = ''; // Đặt lại biến để chọn phòng để xóa
    }
  }
  
 


  private authService = inject(AuthService);
  selectedfile:any = null;
  imagepath:String ="";
  currentuser:User = new User();

  ngOnInit(){
    this.currentuser = JSON.parse(this.authService.getCurrentuser() || '{}');
    console.log(this.currentuser);
    this.socketService.getRoomList().subscribe((rooms) => {
      console.log('Updated room list:', rooms);
      this.rooms = rooms;
    });
  }


   
    
  }

  






