
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { SocketService } from '../services/socket.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Thêm import này
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { Subject } from 'rxjs';
import { fakeAsync } from '@angular/core/testing';




describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let socketService: SocketService;
  let auth: AuthService;
  let domSanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // declarations: [ProfileComponent],
      providers: [SocketService],
      imports: [HttpClientTestingModule],
      
    });
    

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    socketService = TestBed.inject(SocketService);
    domSanitizer = TestBed.inject(DomSanitizer);
    auth = TestBed.inject(AuthService)
    
  });
  

  it('should create the component', () => {
    expect(component).toBeTruthy();
   

  });

  it('should call sendMessage method', () => {
    const spy = spyOn(socketService, 'sendMessage');
    component.message = 'Test message';
    component.sendMessage();
    expect(spy).toHaveBeenCalledWith(component.currentuser.id, component.currentuser.username, 'Test message',Image);
  });
  it('should call deleteRoom method', () => {
    const spy = spyOn(socketService, 'deleteRoom');
    component.selectedRoomId = 'testRoomId'; // Set value for selectedRoomId
    component.deleteSelectedRoom();
    expect(spy).toHaveBeenCalledWith('testRoomId');
    expect(component.selectedRoomId).toBe(''); // To check if selectedRoomId has been delette after deleteSelectedRoom.
  });
  it('should call createRoom method', () => {
    const spy = spyOn(socketService, 'createRoom'); // Create spy for createRoom
    component.newRoomName = 'Test Room'; // set value for newRoomName
    const fakeRoomData = [{ id: 1, name: 'Room 1' }, { id: 2, name: 'Room 2' }];
    spyOn(socketService, 'getRoomList').and.returnValue(of(fakeRoomData)); // Mock with getRoomList
  
    component.createRoom(); // call createRoom
  
    expect(spy).toHaveBeenCalledWith('Test Room'); // To check if createRoom has been called with newRoomName
    expect(component.roomsWithChannels).toEqual(fakeRoomData); // To check if roomsWithChannels has been updated createRoom.
  });
  it('should call deleteRoom method', () => {
    const roomId = '123'; 
    const spy = spyOn(socketService, 'deleteRoom'); 
    const fakeRoomData = [{ id: 1, name: 'Room 1' }, { id: 2, name: 'Room 2' }];
    spyOn(socketService, 'getRoomList').and.returnValue(of(fakeRoomData)); 
  
    component.deleteRoom(roomId); 
  
    expect(spy).toHaveBeenCalledWith(roomId); 
    // To check if roomsWithChannels has been updated or not after deleteRoom.
    expect(component.roomsWithChannels).toEqual(fakeRoomData); 
  });

 
  it('should call leaveRoom method and handle response', () => {
    const roomId =1;
  
    
  
    // call leaveroom
    component.leaveRoom(roomId);
    fixture.detectChanges();
  
    // make sure that leaveRoom has been called in the right way
    expect(component.currentUsers).toEqual([]);
  });
  // it('should call joinRoom method and update currentUsers and roomMessages', () => {
    
  //   const roomId = 1; // Giả định roomId hợp lệ
  //   const roomToTalk = { id: roomId, messages: ['Message 1', 'Message 2'] }; // Dữ liệu giả cho roomToTalk
  //   const userIds = [1, 2, 3]; // Giả định danh sách userIds
  
  //   // Tạo giả lập cho socketService
  //   spyOn(socketService, 'joinRoom');
  //   spyOn(socketService, 'getRoomList').and.returnValue(of([{ id: roomId, users: userIds, messages: ['Message 1', 'Message 2'] }]));
  
  //   // Gọi hàm bạn muốn kiểm tra
  //   component.joinRoom(roomId);
  //   fixture.detectChanges();
  
  //   // Đảm bảo rằng các biến đã được cập nhật đúng cách
  //   expect(component.hidelist).toBe(true);
  //   // expect(component.messsageidroom).toBe(`${roomId}`);
  //   expect(component.currentUsers).toEqual([{ id: 0 }, { id: 1 }, { id: 2 }]);
  //   expect(component.roomMessages[roomId]).toEqual(['Message 1', 'Message 2']);
  // });
  it('should call joinRoom method and update currentUsers and roomMessages', () => {
    const roomId = 1; 
    const roomToTalk = { id: roomId, messages: ['Message 1', 'Message 2'] }; 
    const userIds = [1, 2, 3]; 
  
    // Set up fake value for socket.joinroom
    spyOn(socketService, 'joinRoom');
    spyOn(socketService, 'getRoomList').and.returnValue(of([{ id: roomId, users: userIds, messages: ['Message 1', 'Message 2'] }]));
  
    // Callout joint room
    component.joinRoom(roomId);
    fixture.detectChanges();
    
  
    // To make sure that all the variables has been declare in the right way
    expect(component.hidelist).toBe(true);
    expect(component.messsageidroom).toBe(1); // to check if messsageidroom has been added right
    
  });
  

  it('should handle invalid roomId', () => {
    const consoleErrorSpy = spyOn(console, 'error');
  
    // Gọi hàm bạn muốn kiểm tra
    component.joinRoom(null);
  
    // Đảm bảo rằng thông báo lỗi được in ra
    expect(consoleErrorSpy).toHaveBeenCalledWith('Room ID is invalid.');
  });
  it('should delete a user', () => {
    const userIdToDelete = 1; 
    const userToRemove = { id: userIdToDelete, name: 'User 1' }; 

    // Đặt dữ liệu ban đầu cho users (có userIdToDelete)
    component.users = [userToRemove, { id: 2, name: 'User 2' }, { id: 3, name: 'User 3' }];

    const deleteUserSpy = spyOn(socketService, 'deleteUser');

    // use deleteUser function to delete user
    component.deleteUser(userIdToDelete);

    // To check if deleteUser i called by userIdToDelete
    expect(deleteUserSpy).toHaveBeenCalledWith(userIdToDelete);

    // to check if the user has been remove from the user list or not
    expect(component.users).not.toContain(userToRemove);
  });

  it('should handle deleting a non-existing user', () => {
    const userIdToDelete = 4; 
    const consoleErrorSpy = spyOn(console, 'error');

    // default data for users (no include userIdToDelete)
    component.users = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }, { id: 3, name: 'User 3' }];

    // call deleteUSer to delete user
    component.deleteUser(userIdToDelete);

    // to check if error has been printed out
    expect(consoleErrorSpy).toHaveBeenCalledWith('User not found.');
  });

  
  it('should add a new user when all fields are filled', () => {
    let index = 1; 
    const newUser = {
      username: 'testUser',
      email: 'test@test.com',
      pwd: 'testPassword',
      valid: true,
      avatar: '',
      role: 'USER',
      id: 1, 
    };
  
    // set the value  for newUsername, newEmail and newPassword
    component.newUsername = 'testUser';
    component.newEmail = 'test@test.com';
    component.newPassword = 'testPassword';
    component.index = index ++;
  
    // Crete spy to socketService & addUser
    const addUserSpy = spyOn(socketService, 'addUser');
  
    
    component.createUser();
  
    // to check if addUserSpy has been called newUser yet
    expect(addUserSpy).toHaveBeenCalledWith(newUser);
  
    // to check if newUsername, newEmail & newPassword has been set back to null ?
    expect(component.newUsername).toBe('');
    expect(component.newEmail).toBe('');
    expect(component.newPassword).toBe('');
  
    // to check if newUser has been added to users
    expect(component.users).toContain(newUser);
  });



  it('should request and receive room list in ngOnInit', () => {
    const fakeRoomData = [{ id: 1, name: 'Room 1' }, { id: 2, name: 'Room 2' }];
  
    // Created spy to socketService & relative method
    const reqRoomListSpy = spyOn(socketService, 'reqroomList');
    reqRoomListSpy.and.callFake(() => {
      // called reqroomList and give back value of Observable
      return of(fakeRoomData);
    });
    const getRoomListCallbackSpy = spyOn(socketService, 'getroomList').and.callFake((callback) => {
      callback(JSON.stringify(fakeRoomData));
    });
  
    // activate ngOnInit
    component.ngOnInit();
  
    // to check if reqroomList has been called? 
    expect(reqRoomListSpy).toHaveBeenCalledOnceWith();
  
    // To check if room has been called in the right way?
    expect(component.rooms).toEqual(fakeRoomData);
  });
  //ng test --include src\app\profile\profile.component.spec.ts

  
  
  
  
  
  

  // Add more test cases for other methods

  // Example: it('should do something for method XYZ', () => { ... });
});

