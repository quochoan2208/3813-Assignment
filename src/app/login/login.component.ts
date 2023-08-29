// import { Component,OnInit,inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../services/auth.service';
// import {User} from "../user";
// import {Router} from "@angular/router";
// import { FormsModule } from '@angular/forms';



// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule,FormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit {

 
//   errormsg = "";
//   newuser:User = new User();
//   email:string = "";
//   pwd:string = "";
//   loggedin:boolean = false;
//   private router = inject(Router);
//   private authService = inject(AuthService);

//   ngOnInit() {
//     if (sessionStorage.getItem('currentUser')){
//       this.loggedin = true;
//     }else{
//       this.loggedin = false;
    
//     }
//   }

  
//   signin(event:any){
//     console.log("at signin");
//     event.preventDefault();
//     this.authService.login(this.email,this.pwd).subscribe({
//       next:
//         (data)=>{
//           if (data.valid == true){
//             this.newuser = new User(data.username,data.email)
//             this.authService.setCurrentuser(this.newuser);
//             this.router.navigate(['/home']);
//           }else{
           
//             this.errormsg = "There is a problem with the credentials";
//           }
      
//       error:
//         this.errormsg = "There is a problem with the credentials";
      
//     }
      
   
//   })

// }
// }


import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    errormsg = "";
  newuser:User = new User();
  email:string = "";
  pwd:string = "";
  loggedin:boolean = false;
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.loggedin = true;
    } else {
      this.loggedin = false;
    }
  }

  signin(event: any) {
    console.log('at signin');
    event.preventDefault();
    this.authService.login(this.email, this.pwd).subscribe({
      next: (data) => {
        if (data.valid == true) {
          this.newuser = new User(data.username, data.email);
          this.authService.setCurrentuser(this.newuser);
          this.router.navigate(['/home']);
        } else {
          this.errormsg = 'There is a problem with the credentials';
        }
      },
      error: () => {
        this.errormsg = 'There is a problem with the credentials';
      },
    });
  }
}
