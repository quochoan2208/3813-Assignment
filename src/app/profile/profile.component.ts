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
  selectedUserId: number | null = null;
  selectedUser: any = null;
  roomSelected: boolean = false;
  roomSelections: { [roomId: string]: boolean } = {};
  showCreateUserForm: boolean = false;




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
  index: any;
  channelList: { roomId: string, channels: string[] }[] = [];
  canAddToRoom: boolean = false;
  actionsCompleted: boolean = false;
  indexclick = 0;
  hideeverything = false;
  indexcheck = 0;

 
  joinedRoom: boolean = false;

  
  private authService = inject(AuthService);
  selectedfile:any = null;
  imagepath:String ="";
  currentuser:User = new User();

  constructor(private socketService: SocketService){}
  sendMessage() {
    this.socketService.sendMessage(this.message);
  }
  updateSelectedRoom(userId: number, roomId: any) {
   
    this.selectedRoomId = roomId;
  }
  selectUser(user: any) {
    this.selectedUser = user;
    this.indexclick ++;
    if (this.indexclick % 2 == 0) {
      this.hideeverything = true;
    }else {
      this.hideeverything = false;

    }
  }
  allowAddToRoom() {
    this.canAddToRoom = true;
  }
 
toggleRoomSelection(roomId: string) {
  
  if (this.roomSelections[roomId]) {
    this.roomSelections[roomId] = false;
  } else {

    this.roomSelections[roomId] = true;
  }
}

  
  
  
  
  selectRoom(roomId: string) {
    this.selectedRoomId = roomId;
    this.roomSelected = true;
    
    const selectedRoom = this.roomsWithChannels.find((room) => room.id === roomId);
    if (selectedRoom) {
      this.selectedRoomChannels = selectedRoom.channels;
    }
  }
  createChannelInSelectedRoom() {
    if (this.selectedRoomId && this.newChannelName) {
      this.socketService.createChannel(this.newChannelName, this.selectedRoomId);
  
  
      const selectedRoomIndex = this.channelList.findIndex(room => room.roomId === this.selectedRoomId);
      if (selectedRoomIndex !== -1) {
        this.channelList[selectedRoomIndex].channels.push(this.newChannelName);
      } else {
        this.channelList.push({ roomId: this.selectedRoomId, channels: [this.newChannelName] });
      }
  
     
      this.newChannelName = '';
    }
  }
  turnedon(){
    this.joinedRoom = true;
   
    this.indexcheck ++;
    if (this.indexcheck % 2 == 0){
      this.showCreateUserForm =false;

    }
    else{
      this.showCreateUserForm =true;
    }
    
    
    
  }

  channelExists(roomId: string, channelName: string): boolean {
    const selectedRoom = this.channelList.find(room => room.roomId === roomId);
    return selectedRoom ? selectedRoom.channels.includes(channelName) : false;
  }
  
  deleteSelectedRoom() {
    if (this.selectedRoomId) {
      this.socketService.deleteRoom(this.selectedRoomId);
      this.selectedRoomId = ''; 
    }
  }
  getSelectedRoomName(): string {
    const selectedRoom = this.roomsWithChannels.find((room) => room.id === this.selectedRoomId);
    return selectedRoom ? selectedRoom.name : ' room selected';
  }
  logout(event:any){
    this.authService.logout(event);
    }
  
  createRoom(){
    this.socketService.createRoom(this.newRoomName);
    this.socketService.getRoomList().subscribe((data) => {
      this.roomsWithChannels = data;
    });
  }
  deleteRoom(roomId: string) {
    
    this.socketService.deleteRoom(roomId);
    this.socketService.getRoomList().subscribe((data) => {
      this.roomsWithChannels = data;
    });
  }
  leaveRoom(roomId: string) {
    this.socketService.leaveRoom(roomId);
  
    this.socketService.roomLeft().subscribe((response: any) => {
      if (response.success) {
       
        console.log(`You have left room: ${response.room.name}`);
      
      } else {
        
        console.error(`Failed to leave room: ${response.error}`);
     
      }
    });
    this.socketService.getRoomList().subscribe((data) => {
      this.roomsWithChannels = data;
    });
    console.log(this.rooms)
  }
  joinRoom(roomId: string) {
    
    
    if (roomId) {
      this.socketService.joinRoom(roomId);
      const selectedRoom = this.rooms.find((room) => room.id === roomId);
   
    this.selectedRoomChannels = selectedRoom ? selectedRoom.channels : [];
    this.socketService.getRoomList().subscribe((data) => {
      this.roomsWithChannels = data;
    });
      
    
      this.socketService.roomJoined().subscribe((response: any) => {
        if (response.success) {
         
          console.log(`You have joined room: ${response.room.name}`);
          
        } else {
        
          console.error(`Failed to join room: ${response.error}`);
        
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
  selectUserAndRoom(userId: number, roomId: any) {
    this.selectedUserId = userId;
    this.selectedRoomId = roomId;
  }
  


  confirmDeleteRoom() {
    if (this.roomToDelete) {
      this.socketService.deleteRoom(this.roomToDelete);
      this.roomToDelete = ''; 
    }
  }
  createChannel(roomId: string) {
  
    this.socketService.createChannel(this.newChannelName, roomId);
  }
  deleteUser(userId: number) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
    
      this.users.splice(userIndex, 1);
  
      
      this.socketService.deleteUser(userId);
    } else {
      
      console.error('User not found.');
    }
  }

  createChannelInRoom() {
    if (this.selectedRoomId && this.newChannelName) {
      this.socketService.createChannelInRoom(this.newChannelName, this.selectedRoomId);
    }
  }


  createUser() {
    
   
    if (this.newUsername && this.newEmail && this.newPassword) {
      
      const newUser = {
        username: this.newUsername,
        email: this.newEmail,
        pwd: this.newPassword,
        valid: true, 
        avatar: '', 
        role: 'USER',
        id: this.index 
      };
      this.index++;
      this.users.push(newUser);
      

    
      this.socketService.addUser(newUser);
      this.newUsername = '';
      this.newEmail = '';
      this.newPassword = '';

     
      
      console.error('Please fill in all fields.');
      
    }
  }
  addUserToRoom(userId: any, roomId: number) {
    this.actionsCompleted= true;
    this.socketService.addUserToRoom(userId, roomId);
    if (roomId !== null && roomId !== undefined) {
      
      console.log('Selected Room ID:', roomId - 1);
      
    } else {
      
      console.error('Please select a room before adding the user.');
    }
    
  }
  
 



  ngOnInit(){
    this.currentuser = JSON.parse(this.authService.getCurrentuser() || '{}');
    console.log(this.currentuser);
    this.socketService.userDeleted().subscribe((deletedUserId: number) => {
      console.log(`User with ID ${deletedUserId} has been deleted.`);
      
    });
    this.socketService.getUsersList().subscribe((userList: any[]) => {
      this.users = userList;
    });

  
  
    this.socketService.userDeleteError().subscribe((error: string) => {
      console.error(`Failed to delete user: ${error}`);
   
    });
   
    this.socketService.getRoomList().subscribe((data) => {
      console.log('Updated room list:', data);
      this.rooms = data;
    });
    
    
  }


   
    
  }

  






