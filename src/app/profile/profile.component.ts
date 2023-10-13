import { Component ,inject,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import {User} from '../user';
import { SocketService } from '../services/socket.service';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  safeImageUrl: SafeUrl | null = null;
  privateMessage: any[] = []; 
  newRoomName: string = '';
  message: string = '';
  messages: any[] = [];
  newuserid : number | null = null;
  messagesforroom: any[] = [];
  messsageidroom: string = '' ;
  Openboxchatprivate: boolean = false;
  rcid: number |null = null;
  
  
  
  roomToDelete: string = '';
  newChannelName: string = '';
  roomsWithChannels: any[] = [];
  selectedRoomId: string = '';
  selectedUserId: number | null = null;
  selectedUser: any = null;
  roomSelected: boolean = false;
  roomSelections: { [roomId: string]: boolean } = {};
  showCreateUserForm: boolean = false;
  usersInSelectedRoom: any[] = [];
  currentUsers: any[] = [];
  currentRoomUsers: string[] = [];
  hidelist: boolean = false;
  rooms : any[] =  [

  ];
  messageText: string = '';
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
  roomMessages: { [roomId: string]: any[] } = {};

  constructor(private socketService: SocketService,private auth: AuthService,private sanitizer: DomSanitizer){
    this.socketService.onPrivateMessage().subscribe((message: any) => {
      console.log(message);
      this.privateMessage.push(message);
      console.log(this.privateMessage);
  });
 

    this.socketService.on('messageforroom').subscribe((message: any) => {
      console.log(message);
      const roomId = this.messsageidroom;
      if (!this.roomMessages[roomId]) {
        this.roomMessages[roomId] = [];
      }
      this.roomMessages[roomId].push(message);
    console.log(this.roomMessages[roomId]);
    });
    this.socketService.on('message').subscribe((message: string) => {
      
      this.messages.push(message);
      console.log(message);
    });

    

  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  displayImage() {
    if (this.selectedFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }
  // sendMessage() {
  //   this.socketService.sendMessage(this.message);
  // }
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
    this.hidelist = true;
    this.socketService.leaveRoom(roomId, this.currentuser.id);

    this.socketService.roomLeft().subscribe((response: any) => {
      if (response.success) {
        console.log(`You have left room: ${response.room.name}`);
      } else {
        console.error(`Failed to leave room: ${response.error}`);
      }
      this.currentUsers = [];
      
    });

    // Cập nhật danh sách phòng sau khi rời phòng (nếu cần)
    this.socketService.getRoomList().subscribe((data) => {
      // Cập nhật roomsWithChannels hoặc thực hiện các thao tác cần thiết
    });
  }


  // joinRoom(roomId: string) {
  //   if (roomId) {
      
  //       this.socketService.joinRoom(roomId, this.currentuser.id);
       
  //   } else {
  //     console.error('Room ID is invalid.');
  //   }
  // }
  // joinRoom(roomId: string) {
  //   if (roomId) {
  //     this.socketService.joinRoom(roomId, this.currentuser.id);
  
  //     // Lấy danh sách người dùng từ dữ liệu của bạn
  //     const room = this.rooms.find((room) => room.id === roomId);
  //     const userIds = room ? room.users : [];
  
  //     // Tìm tên người dùng dựa trên ID
  //     const userNames = userIds.map((userId: number) => {
  //       const user = this.users.find((user) => user.id === userId);
  //       return user ? user.name : 'Unknown User';
  //     });
  
  //     // Lưu danh sách tên người dùng trong một biến của ứng dụng hoặc mảng trạng thái.
  //     this.usersInSelectedRoom = userNames;
  //   } else {
  //     console.error('Room ID is invalid.');
  //   }
  // }
  // joinRoom(roomId: string) {
  //   if (roomId) {
  //     this.socketService.joinRoom(roomId, this.currentuser.id);
  
  //     // Lấy danh sách người dùng từ dữ liệu của bạn
  //     const room = this.rooms.find((room) => room.id === roomId);
  //     const userIds = room ? room.users : [];
  
  //     // Tìm tên người dùng dựa trên ID
  //     const userNames = userIds.map((userId: number) => {
  //       const user = this.users.find((user) => user.id === userId);
  //       return user ? user.username : 'Unknown User';
  //     });
  
  //     // Lưu danh sách tên người dùng trong một biến của ứng dụng hoặc mảng trạng thái.
  //     this.usersInSelectedRoom = userNames;
  //   } else {
  //     console.error('Room ID is invalid.');
  //   }
  // }
  joinRoom(roomId: any) {
    if (roomId) {
      this.hidelist = false;
      this.socketService.joinRoom(roomId, this.currentuser.id);
      console.log(roomId);
      this.messsageidroom = roomId;
      console.log(roomId);
      const roomToTalk = this.rooms.find((room) => room.id === roomId);
      if (roomToTalk) {
          this.roomMessages[roomId] = roomToTalk.messages;
      } else {
          console.log('Invalid roomId');
      }
      
        
      
      
     

      const room = this.rooms.find((room) => room.id === roomId);
      const userIds = room ? room.users : [];
      
      // Lưu danh sách tên người dùng trong biến currentUsers
      this.currentUsers = userIds.map((userId: number) => {
        const user = this.users.find((user) => user.id === userId);
        return user ? user : null;
        
      });
    } else {
      console.error('Room ID is invalid.');
    }
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
 
  deleteUser(userId: number) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
    
      this.users.splice(userIndex, 1);
  
      
      this.socketService.deleteUser(userId);
    } else {
      
      console.error('User not found.');
    }
  }
  createChannel(roomId: string) {
  
    this.socketService.createChannel(this.newChannelName, roomId);
  }
  createChannelInRoom() {
    if (this.selectedRoomId && this.newChannelName) {
      this.socketService.createChannelInRoom(this.newChannelName, this.selectedRoomId);
    }
  }
  channelExists(roomId: string, channelName: string): boolean {
    const selectedRoom = this.channelList.find(room => room.roomId === roomId);
    return selectedRoom ? selectedRoom.channels.includes(channelName) : false;
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
  openboxchatprivate() {
    this.Openboxchatprivate = true;
    console.log("call private");

  }
  // sendPrivateMessage(receiverId: number, message: string) {
  //   console.log(receiverId)
  //   console.log("called")
  //   if (this.messageText) {
  //     this.socketService.sendPrivateMessage(receiverId, this.messageText);
  //     this.messageText = ''; // Xóa nội dung tin nhắn sau khi gửi
  //   }
  // }
  
  addUserToRoom(userId: any, roomId: number) {
    this.actionsCompleted= true;
    this.socketService.addUserToRoom(userId, roomId);
    if (roomId !== null && roomId !== undefined) {
      
      console.log('Selected Room ID:', roomId - 1);
      
    } else {
      
      console.error('Please select a room before adding the user.');
    }
    
  }
  updateRoomList() {
    this.socketService.getRoomList().subscribe((data) => {
      this.roomsWithChannels = data;
    });
  }
  
 



  ngOnInit(){
  


    
   
    this.hidelist = true;
    this.currentuser = JSON.parse(this.authService.getCurrentuser() || '{}');
    console.log(this.currentuser);
    this.socketService.reqroomList();
    this.socketService.getroomList((msg:string)=>{ this.rooms = JSON.parse(msg)
      // console.log(this.rooms[6].messages)
    });
    
    this.socketService.userDeleted().subscribe((deletedUserId: number) => {
      console.log(`User with ID ${deletedUserId} has been deleted.`);
      
    });

    this.socketService.getUsersList().subscribe((userList: any[]) => {
      this.users = userList;
    });
    this.newuserid = this.authService.getUserId();
    console.log(this.currentuser.id);


  
  
    this.socketService.userDeleteError().subscribe((error: string) => {
      console.error(`Failed to delete user: ${error}`);
   
    });
  
    this.socketService.getRoomList().subscribe((data) => {
      console.log('Updated room list:', data);
      this.rooms = data;
    });
    this.updateRoomList();
    
    
  }
  sendMessage() {
    if (this.message) {
      // Replace 'your_user_id' with the actual user ID
      this.socketService.sendMessage(this.currentuser.id, this.currentuser.username,this.message);
      this.message = ''; // Clear message input after sending
    }
  }
  sendMessageForRoom(roomId: number): void {
    console.log('sendMessageForRoom() called');

    if (this.message && roomId ) {
      this.socketService.sendMessageToRoom(roomId, this.currentuser.id, this.currentuser.username, this.message);
      console.log(this.message);
      console.log("Id:" + roomId);
      this.message = ''; // Xóa nội dung tin nhắn sau khi gửi
    } 
  }

//   openPrivateChat(userId: number) {
//     this.socketService.openPrivateChat(userId);
// }
openPrivateChat(userId:number) {

  this.socketService.openPrivateChat(userId);


  // console.log("called:" + userId);
  // this.rcid = userId;
}

sendPrivateMessage( receiverId: number, message: any) {
  console.log("sent:" + receiverId + message)
    this.socketService.sendPrivateMessage(this.currentuser.username,receiverId, message);
    
}



   
    
  }

  






