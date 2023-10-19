import { browser, by, element, protractor } from 'protractor';

describe('Profile Page', () => {
  beforeAll(() => {
   
  });

  it('should display the user profile', async () => {
    
    const userProfile = element(by.css('.user-profile'));
    const username = element(by.css('.username'));
    const email = element(by.css('.email'));
   

    browser.get('http://localhost:4200/profile'); 

    
    browser.wait(protractor.ExpectedConditions.visibilityOf(userProfile), 5000, 'User profile not displayed');
    browser.wait(protractor.ExpectedConditions.visibilityOf(username), 5000, 'Username not displayed');
    browser.wait(protractor.ExpectedConditions.visibilityOf(email), 5000, 'Email not displayed');



const usernameText = await username.getText();
const emailText = await email.getText();

expect(usernameText).toEqual('JohnDoe');
expect(emailText).toEqual('john@example.com');

  })

  it('should allow updating the user profile', () => {
   
    element(by.css('.edit-profile-button')).click(); 
    element(by.css('.new-username')).sendKeys('NewUsername'); 
    element(by.css('.save-button')).click(); 

  });

  it('should handle errors during profile update', () => {
 
    const editButton = element(by.css('.edit-button'));
    editButton.click();

    const invalidInfo = 'invalid';
    const nameInput = element(by.css('.name-input'));
    nameInput.clear();
    nameInput.sendKeys(invalidInfo);

    
    const saveButton = element(by.css('.save-button'));
    saveButton.click();

    const errorAlert = element(by.css('.error-alert'));
    expect(errorAlert.isPresent()).toBeTruthy();
    expect(errorAlert.getText()).toContain('Invalid information'); 
  });

  afterAll(() => {
  

    
    element(by.css('.logout-button')).click(); 
    expect(element(by.css('.login-button')).isDisplayed()).toBeTruthy(); 
  });
});
