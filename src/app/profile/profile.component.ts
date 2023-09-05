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
  rooms : any[] = ["Room1","Room2","Room3","Room4"];
  constructor(private socketService: SocketService){}
  sendMessage() {
    this.socketService.sendMessage(this.message);
  }
  createRoom(){
    this.socketService.createRoom(this.newRoomName)
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

    // this.socketService.receiveMessage((message) => {
    // console.log(`Received message: ${message}`);
    // this.receivedMessages.push(message)
    
    //   } 


   
    
  }

  






