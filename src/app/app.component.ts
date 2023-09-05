import { AuthService } from './services/auth.service';
import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Assignment';
  private authServices = inject(AuthService);

  logout(event:any){
    this.authServices.logout(event);
    }
}
