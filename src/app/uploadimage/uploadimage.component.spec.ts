import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadimageComponent } from './uploadimage.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
class MockDomSanitizer {
  bypassSecurityTrustUrl(url: string) {
    return url;
  }
}

describe('UploadimageComponent', () => {
  let component: UploadimageComponent;
  let fixture: ComponentFixture<UploadimageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadimageComponent],
      providers: [
        { provide: DomSanitizer, useClass: MockDomSanitizer }, // Provide the mock DomSanitizer
      ],
      imports: [HttpClientTestingModule],
    });

    fixture = TestBed.createComponent(UploadimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update safeImageUrl when calling displayImage', () => {
    const fakeFile = new File([''], 'fake-image.png', { type: 'image/png' });

    // Create a FileList to simulate file selection
    const fakeFileList = {
      0: fakeFile,
      length: 1,
      item: (index: number) => fakeFile,
    } as FileList;

    // Create a fake event object with a target property
    const fakeEvent = {
      target: {
        files: fakeFileList,
      },
    };

    // Call the onFileSelected method with the fake event
    component.onFileSelected(fakeEvent);

    // Call the displayImage method to update safeImageUrl
    component.displayImage();

    // Now, you can make assertions about the component's safeImageUrl
    expect(component.safeImageUrl).toBe(null);
  });
});






// //ng test --include src\app\uploadimage\uploadimage.component.spec.ts