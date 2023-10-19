

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../user'; 
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorregister:string ="";
  newUsername: string = "";
  newEmail: string ="";
  newPassword: string ="";
  users: any[] = [];
  index: any;
    errormsg = "";
    loginstate: boolean = false;
    registerstate: boolean = false;
    loginForm: FormGroup | undefined;
  newuser:User = new User();
  email:string = "";
  pwd:string = "";
  loggedin:boolean = false;
  showCreateUserForm: boolean = false;
  indexcheck = 0;
 
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,private socketService: SocketService) {}


  ngOnInit() {
    // Initialize the login form.
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    // Check if the user is logged in based on local storage.
    if (localStorage.getItem('currentUser')) {
      this.loggedin = true;
      
    } else {
      this.loggedin = false;
    }
  }
  turnedon(){
    
   
    this.indexcheck ++;
    if (this.indexcheck % 2 == 0){
      this.showCreateUserForm =false;

    }
    else{
      this.showCreateUserForm =true;
    }
    
    
    
  }

  register(){
    this.registerstate = true;// Set the registration state.

  }
  dologin(){
    this.registerstate = false;// Set the login state.
  }
  createUser() {
    // Create a new user.
   
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

     
      
      console.log('Succesfully Created account');
      
    }
    else {
      console.error('Please fill in all field.');
      this.errorregister = 'Please enter a valid email and password';
    }
  }
  //for logging out account
  logout(event:any){
    this.authService.logout(event);
    }
    // Attempt user login.
  signin(event: any) {
    
    console.log('at signin');
    event.preventDefault();
    this.authService.login(this.email, this.pwd).subscribe({
      next: (data) => {
        
        if (data.valid == true) {
          
          
          this.newuser = new User(data.username, data.email, data.pwd, data.valid, data.avatar, data.role, data.id);
          const userId = this.newuser.id;
       
          this.authService.setCurrentuser(this.newuser);
          this.router.navigate(['/profile']);
        } else {
          this.errormsg = 'Please enter a valid email and password';
        }
      },
      error: () => {
        this.errormsg = 'Please enter a valid email and password';
      },
    });
  }
}
// //ng test --include src\app\login\login.component.spec.ts
