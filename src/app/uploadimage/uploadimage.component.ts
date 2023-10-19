import { Component, OnInit, inject } from '@angular/core';
import { ImguploadService } from '../imgupload.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { User } from '../user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-uploadimage',
  templateUrl: './uploadimage.component.html',
  styleUrls: ['./uploadimage.component.css']
})
export class UploadimageComponent implements OnInit {
  title = 'imageupload';
  edited: boolean = false;
  urlbefore = "https://i.pinimg.com/564x/71/c3/50/71c350f1204e6221a2e45b6c0fb2cb68.jpg"
  selectedfile:any = null;
  imagepath="";
  selectedFile: File | null = null;
  currentuser:User = new User();
  safeImageUrl: SafeUrl | null = null;
  role: string = "Group Admin"
  private authService = inject(AuthService);
  constructor(private imguploadService:ImguploadService, private sanitizer: DomSanitizer){}
  ngOnInit(): void {
    this.edited = false;// Set edited to false initially.
    // Retrieve the current user's data.
    this.currentuser = JSON.parse(this.authService.getCurrentuser() || '{}');
    // Retrieve the current user's data.
    console.log(this.currentuser);
    if(this.currentuser.role == "SUP"){
      this.role = "Super Admin"
      this.urlbefore = "https://scontent.fbne10-1.fna.fbcdn.net/v/t39.30808-6/358067083_1000520291078919_6332296526112754721_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=5xQWB3kkaMgAX9CON06&_nc_ht=scontent.fbne10-1.fna&oh=00_AfC8i5KE3XevOqYHvgA6fbTkml8l9oCjFPd8B5EoX7Es6w&oe=65321E22"

    }
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    // Store the selected file when a file is chosen.
  }
  editedimage(){
    this.edited = true;// Set the edited flag to true when image is edited.
  }

  displayImage() {
    this.edited = false;// Set edited flag to false after displaying the image.
   
    if (this.selectedFile) {
      // Display the selected image safely using a SafeUrl.
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log("image push")
        this.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(this.selectedFile);
}}}
