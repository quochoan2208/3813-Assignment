import { browser, by, element } from 'protractor';

describe('Login Page', () => {
  beforeEach(() => {
   
    browser.get('/login');
  });

  it('should display the login form', () => {
   
    const usernameInput = element(by.css('input[name="email"]'));
    const passwordInput = element(by.css('input[name="pwd"]'));
    const submitButton = element(by.css('button[type="submit"]'));

    expect(usernameInput.isPresent()).toBeTruthy();
    expect(passwordInput.isPresent()).toBeTruthy();
    expect(submitButton.isPresent()).toBeTruthy();
  });

  it('should allow users to log in', () => {
   
    const usernameInput = element(by.css('input[name="email"]'));
    const passwordInput = element(by.css('input[name="pwd"]'));
    const submitButton = element(by.css('button[type="submit"]'));

    usernameInput.sendKeys('abg@com.au');
    passwordInput.sendKeys('123');
    submitButton.click();

    const loggedInMessage = element(by.css('.loggedin-message'));
    expect(loggedInMessage.isPresent()).toBeTruthy();
  });

  it('should show an error message for invalid credentials', async () => {

    const usernameInput = element(by.css('input[name="email"]'));
    const passwordInput = element(by.css('input[name="pwd"]'));
    const submitButton = element(by.css('button[type="submit"]'));

    usernameInput.sendKeys('invalid_username');
    passwordInput.sendKeys('invalid_password');
    submitButton.click();

    const errorMessage = element(by.css('#errormsg'));
    expect(await errorMessage.getText()).toEqual('There is a problem with the credentials');

  });
});
