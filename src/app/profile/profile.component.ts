import { Component ,inject,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../services/auth.service';
import {User} from '../user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{


  private authService = inject(AuthService);
  selectedfile:any = null;
  imagepath:String ="";
  currentuser:User = new User();

  ngOnInit(){
    this.currentuser = JSON.parse(this.authService.getCurrentuser() || '{}');
    console.log(this.currentuser);
  }


}