import { Component } from '@angular/core';
import { ImguploadService } from '../imgupload.service';

@Component({
  selector: 'app-uploadimage',
  templateUrl: './uploadimage.component.html',
  styleUrls: ['./uploadimage.component.css']
})
export class UploadimageComponent {
  title = 'imageupload';
  selectedfile:any = null;
  imagepath="";
  constructor(private imguploadService:ImguploadService){}
  onFileSelected(event:any){
    this.selectedfile = event.target.files[0];
  }
  onUpload(){
    const fd = new FormData();
    fd.append('image',this.selectedfile,this.selectedfile.name);
    this.imguploadService.imgupload(fd).subscribe(res=>{  
    this.imagepath = res.data.filename;
   
  });
}
}
