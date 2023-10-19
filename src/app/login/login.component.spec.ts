
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: Router;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'logout', 'setCurrentuser', 'isLoggedin']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
      ],imports: [HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();// Check if the component is created successfully.
  });

  it('should initialize correctly', () => {
    expect(component.loggedin).toBeFalsy();// Check if the 'loggedin' property is initially set to false.
    expect(component.errormsg).toBe('');// Check if the 'errormsg' property is initially an empty string.
    // ...
  });

  it('should handle login success', () => {
    const validUser = new User('John Doe', 'john@example.com', 'password', true);
    mockAuthService.login.and.returnValue(of(validUser));

    const mockEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
    };

    component.signin(mockEvent);

    expect(mockAuthService.login).toHaveBeenCalledWith(component.email, component.pwd);// Check if login method is called with correct parameters.
    expect(component.newuser).toEqual(validUser);// Check if the 'newuser' property is set to the valid user.
    expect(component.errormsg).toEqual('');// Check if the 'errormsg' property is empty.
    expect(mockEvent.preventDefault).toHaveBeenCalled(); // Check if preventDefault was called.
  });
  it('should handle login error', () => {
        mockAuthService.login.and.returnValue(of(new User('', '', '', false)));
    
        const mockEvent = {
          preventDefault: jasmine.createSpy('preventDefault'),
        };
    
        component.signin(mockEvent);
    
        expect(mockAuthService.login).toHaveBeenCalledWith(component.email, component.pwd);// Check if login method is called with correct parameters.
        expect(component.newuser).toEqual(new User());// Check if 'newuser' is set to an empty User.
        expect(component.errormsg).toEqual('There is a problem with the credentials'); // Check if 'errormsg' reflects the login error.
      });
    

});
