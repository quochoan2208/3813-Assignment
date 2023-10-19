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
  useridtochat: number | null = null;
  usernametochat: string = '';
  roomchat: boolean = false;
  showprivate: boolean = false;
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  safeImageUrl: SafeUrl | null = null;
  privateMessage: any[] = []; 
  newRoomName: string = '';
  message: string = '';
  messages: any[] = [];
  newuserid : number | null = null;
  messagesforroom: any[] = [];
  messsageidroom: any = '' ;
  Openboxchatprivate: boolean = false;
  rcid: number |null = null;
messagejoinroom: string = "";
  
  
  
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
  socket: any;
  
// Constructor for the profile component
  constructor(private socketService: SocketService,private auth: AuthService,private sanitizer: DomSanitizer){
     // Subscribe to private messages from the socket service
    this.socketService.onPrivateMessage().subscribe((message: any) => {
      console.log(message);
      this.privateMessage.push(message);
      console.log(this.privateMessage);
  });
 
    // Subscribe to messages for specific rooms from the socket service
    this.socketService.on('messageforroom').subscribe((message: any) => {
      console.log(message);
      const roomId = this.messsageidroom;
      if (!this.roomMessages[roomId]) {
        this.roomMessages[roomId] = [];
      }
      this.roomMessages[roomId].push(message);
    console.log(this.roomMessages[roomId]);
    });
    // Subscribe to general messages from the socket service
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
// Display the selected image and send it as a message
      reader.onload = (e: any) => {
        this.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
       
         // Send message and image
      this.socketService.sendMessage(this.currentuser.id, this.currentuser.username, this.message, this.safeImageUrl);

      this.message = '';

      };

      reader.readAsDataURL(this.selectedFile);
    }
  }
// Update the selected chat room based on the provided user and room.
  updateSelectedRoom(userId: number, roomId: any) {
   
    this.selectedRoomId = roomId;
  }
  // Select a user for private chat, update UI, and open the private chat
  selectUser(user: any) {
    this.selectedUser = user;
    this.showprivate = true;
    this.hidelist = false;
    this.usernametochat = user.username;
    console.log(this.usernametochat);
    this.openPrivateChat(user.id);
   
    this.indexclick ++;
    if (this.indexclick % 2 == 0) {
      this.hideeverything = true;
    }else {
      this.hideeverything = false;

    }
  }
  // Revert to the previous state by hiding the private chat and showing the user list.
  setback(){
    this.hidelist = true;
    this.showprivate = false;
  }
  // Allow the addition of users to a chat room by setting a flag.
  allowAddToRoom() {
    this.canAddToRoom = true;
  }
 // Toggle the selection state of a chat room.
toggleRoomSelection(roomId: string) {
  
  if (this.roomSelections[roomId]) {
    this.roomSelections[roomId] = false;
  } else {

    this.roomSelections[roomId] = true;
  }
}

  
  
  
  // Select a chat room and set its ID as the selected room.
  selectRoom(roomId: string) {
    this.selectedRoomId = roomId;
    this.roomSelected = true;
    
    const selectedRoom = this.roomsWithChannels.find((room) => room.id === roomId);
    if (selectedRoom) {
      this.selectedRoomChannels = selectedRoom.channels;
    }
  }
  // Create a new channel within the currently selected room.
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
  // Turn on a feature, such as 'joinedRoom'.
// Toggle the 'showCreateUserForm' based on user interaction.
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

 
  // Delete the selected chat room if it's defined.
  deleteSelectedRoom() {
    if (this.selectedRoomId) {
      this.socketService.deleteRoom(this.selectedRoomId);
      this.selectedRoomId = ''; 
    }
  }
  // Get the name of the currently selected room from 'roomsWithChannels'.
  getSelectedRoomName(): string {
    const selectedRoom = this.roomsWithChannels.find((room) => room.id === this.selectedRoomId);
    return selectedRoom ? selectedRoom.name : ' room selected';
  }
  // Log out the user by calling the 'logout' method from the 'AuthService'.
  logout(event:any){
    this.authService.logout(event);
    }
  
// Create a new chat room with the provided room name.
// Subscribe to the updated list of rooms with channels.
  createRoom(){
    this.socketService.createRoom(this.newRoomName);
    this.socketService.getRoomList().subscribe((data) => {
      this.roomsWithChannels = data;
    });
  }
  // Delete a chat room based on the provided room ID.
// Subscribe to the updated list of rooms with channels after deletion.
  deleteRoom(roomId: string) {
    
    this.socketService.deleteRoom(roomId);
    this.socketService.getRoomList().subscribe((data) => {
      this.roomsWithChannels = data;
    });
  }
// Leave a chat room, update UI flags and send a leave message.
// Subscribe to the room leave response and update the list of current users in the room.
  leaveRoom(roomId: any) {
    this.hidelist = true;
    this.roomchat = false;
    this.message = this.currentuser.username + " has left the room"
    this.sendMessageForRoom(roomId);
    this.socketService.leaveRoom(roomId, this.currentuser.id);

    this.socketService.roomLeft().subscribe((response: any) => {
      if (response.success) {
        console.log(`You have left room: ${response.room.name}`);
      } else {
        console.error(`Failed to leave room: ${response.error}`);
      }
      this.currentUsers = [];
      
    });

    // update a list of room 
    this.socketService.getRoomList().subscribe((data) => {
      
    });
  }

// Join a chat room by roomId, if a valid roomId is provided.
  joinRoom(roomId: any) {
    if (roomId) {
      this.hidelist = false;
      this.roomchat = true;
      this.socketService.joinRoom(roomId, this.currentuser.id);
      this.message = this.currentuser.username + `  has joined the room`
      this.sendMessageForRoom(roomId)

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
      
      // Retrieve a list of user IDs in the room and map them to user objects in currentUsers.
      this.currentUsers = userIds.map((userId: number) => {
        const user = this.users.find((user) => user.id === userId);
        return user ? user : null;
        
      });
    } else {
      console.error('Room ID is invalid.');
    }
  }
  
  


  // Select a user and room by their IDs.
  selectUserAndRoom(userId: number, roomId: any) {
    this.selectedUserId = userId;
    this.selectedRoomId = roomId;
  }
  

// Confirm and delete a room if the roomToDelete variable is set.
  confirmDeleteRoom() {
    if (this.roomToDelete) {
      this.socketService.deleteRoom(this.roomToDelete);
      this.roomToDelete = ''; 
    }
  }
 // Delete a user based on their user ID.
  deleteUser(userId: number) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
    
      this.users.splice(userIndex, 1);
  
      
      this.socketService.deleteUser(userId);
    } else {
      
      console.error('User not found.');
    }
  }
  // Create a channel in a specific room using the provided room ID.
  createChannel(roomId: string) {
  
    this.socketService.createChannel(this.newChannelName, roomId);
  }
  // Create a channel in the selected room if both the room and channel name are provided.
  createChannelInRoom() {
    if (this.selectedRoomId && this.newChannelName) {
      this.socketService.createChannelInRoom(this.newChannelName, this.selectedRoomId);
    }
  }
  // Check if a channel with a given name exists in a specific room.
  channelExists(roomId: string, channelName: string): boolean {
    const selectedRoom = this.channelList.find(room => room.roomId === roomId);
    return selectedRoom ? selectedRoom.channels.includes(channelName) : false;
  }

// Create a new user if all required fields are filled.
  createUser() {
    
   
    if (this.newUsername && this.newEmail && this.newPassword) {
      
      const newUser = {
        username: this.newUsername,
        email: this.newEmail,
        pwd: this.newPassword,
        valid: true, 
        avatar: "", 
        role: 'GRO',
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
  // Open a private chat box for sending private messages
  openboxchatprivate() {
    this.Openboxchatprivate = true;
    console.log("call private");

  }
 
  // Add a user to a specific room based on user and room IDs.
  addUserToRoom(userId: any, roomId: number) {
    this.actionsCompleted= true;
    this.socketService.addUserToRoom(userId, roomId);
    if (roomId !== null && roomId !== undefined) {
      
      console.log('Selected Room ID:', roomId - 1);
      
    } else {
      
      console.error('Please select a room before adding the user.');
    }
    
  }
  // Update the list of rooms by fetching the latest data from the server.
  updateRoomList() {
    this.socketService.getRoomList().subscribe((data) => {
      this.roomsWithChannels = data;
    });
  }
  
 



  ngOnInit(){
  


    
     // Subscribe to events and update room list
    this.hidelist = true;
    this.currentuser = JSON.parse(this.authService.getCurrentuser() || '{}');
    console.log(this.currentuser);
    this.socketService.reqroomList();
    this.socketService.getroomList((msg:string)=>{ this.rooms = JSON.parse(msg)
      // console.log(this.rooms[6].messages)
    });
     // Subscribe to user events
    this.socketService.userDeleted().subscribe((deletedUserId: number) => {
      console.log(`User with ID ${deletedUserId} has been deleted.`);
      
    });
// Subscribe to user list updates
    this.socketService.getUsersList().subscribe((userList: any[]) => {
      this.users = userList;
    });
    // this.newuserid = this.authService.getUserId();
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
      // Send a general chat message
      this.socketService.sendMessage(this.currentuser.id, this.currentuser.username,this.message,this.safeImageUrl);
      this.message = ''; // Clear message input after sending
      this.safeImageUrl = null;
     
    }
  }
  // This method is used to send a message to a specific chat room.
  sendMessageForRoom(roomId: number): void {
    console.log('sendMessageForRoom() called');

    if (this.message && roomId ) {
      this.socketService.sendMessageToRoom(roomId, this.currentuser.id, this.currentuser.username, this.message);
      console.log(this.message);
      console.log("Id:" + roomId);
      this.message = ''; 
    } 
  }

// This method is used to initiate a private chat with a specific user.
// It sets the 'useridtochat' property to the user's ID and shows the private chat interface.
openPrivateChat(userId:number) {

  this.socketService.openPrivateChat(userId);
  this.useridtochat = userId;
  console.log(this.useridtochat);
  this.hidelist = false

}
// This method is used to send a private message to another user.
// It takes the recipient's user ID and the message content as parameters.
// It uses the socket service to send the private message and then clears the message input.
sendPrivateMessage( receiverId: any, message: any) {
  console.log("sent:" + receiverId + message)
    this.socketService.sendPrivateMessage(this.currentuser.username,receiverId, message);
    this.message = '';
    
}



   
    
  }

  






