# 3813-Assignment
This is a Realtime-chat project.
<--><!-- 


# Git 
Repository Layout: 
The layout of a Git repository plays an essential role in organizing a project. A good layout makes it easy to find and understand the project structure. One common approach is using the master/main branch model and sub-branches for feature development, bug fixes, or separate work. 

 


Main Branch: This is the base and stable branch of the project. The stable version of the product or application is always maintained on this branch. 

 
 

   

 
 

Development Branch: A development branch from the main branch is created to develop new features and fix bugs. This development branch is where people work and test new features. 

 
 

   

 
 

Feature Branches: Each new feature or exceptional work should be developed on a separate branch. Once completed, merge this feature branch into the development branch. 

 
 

 

  

Version Control Approach: 

 
 

   

 
 

Commit Regularly: Make commits often and use clear messages to describe the change. This helps to have a clear history of the project's development and find specific changes easily. 

 
 

   

 
 

Pull Request and Code Review: Use Pull Request or Merge Request to propose changes to the master branch. This provides tighter control and opportunities for source code reviews by other team members to ensure code quality and programming code compliance. 

 
 

   

 
 

Use Versions (Tags): Use versions (tags) to mark stable versions of a product or application. This makes it easy to access a specific version in the future. 

 
 
 

Regular Backups: Perform regular repository backups to ensure data security and recovery when needed. 

 
 
 

Permission Management: Control access to the repository to ensure that only the necessary people have the authority to change the source code. 

 
Organizing your repository and adopting this approach helps ensure project stability, version control, and effectiveness. 

 

# Data Critiria 


USER: 
 
This data file is a JSON file containing information about the users in the system. Each user is represented by a JSON object, which includes the username, email address, password, valid status, role, and an avatar address, if applicable. The system can manage and control users' access rights, define their roles, and maintain basic personal information through this structure. This helps to create an efficient and secure account management environment in the application or project. 

 

{"people":[{"username": <String>, 

“email”: <String>, 

"pwd":<String>, 

"valid":<boolean>, 

"avatar":<String>, 

"role":"SUP", 

"id":<UUID>}] 

 

People: This is an array containing information about people. Each element in the array is a JSON object representing information about a specific person. 

  

   

  

username: This attribute stores the username of each person. For example, "Noah", "Usopp", and "Harmonie" are the usernames corresponding to each subject. 

  

   

  

email: This property stores each person's email address. For example, "abg@com.au", "usopp@com.au", and "harmonie@com.au" are email addresses corresponding to each person. 

  

   

  

pwd: This attribute stores each person's password. Note that the password is represented as the simple string "123" in the example you provided. In real environments, passwords should be more secure. 

  

   

  

valid: This attribute represents the validity of the user account. If the value is true, the account is valid. In this example, all accounts are marked as valid. 

  

   

  

avatar: This attribute can be used to store the path to each person's avatar, but in this example, all "avatar" fields are blank (empty string). 

  

   

  

role: This attribute determines the role of each person in the system. In this example, there are three different roles: "SUP" (Supervisor), "GRO" (Group Leader), and "USER" (User). 

  

   

  

id: This attribute is often used to identify each user uniquely. 

  

   

  

This JSON file is used to store information about users and can be used in web applications or user management systems to define and control user access and roles in the system. 

 

 
ROOM: 

  

  

  

         { id: 1, 

  

name: 'Room 1', 

  

  channels: [Array(any)] 

  

, 

  

  users: Array(any)}, 

  

This data structure describes a list of rooms, each of which can contain channels and users. This can be used to organize and manage chats or interactions in an application where users can join different rooms and channels. 

  

   

  

rooms: This array contains information about rooms in an application or system. A JSON object in the array represents each room. 

  

   

  

id: This attribute represents each room's unique identifier. 

  

   

  

name: This attribute contains the name of each room. 

  

   

  

channels: This attribute is a nested array containing information about channels in each room. A JSON object in this subarray also represents each channel. 

  

   

  

id: Similar to room, this attribute represents the unique identifier of each channel in the room. 

  

   

  

name: This attribute contains the name of each channel. 

  

   

  

   

  

users: This attribute is an empty array (users: []). It will be used to store information about specific users belonging to this room. 

# REST API && Angular Document

# Angular Document -->

  

The server-side not only provides data and functions to the client, but also ensures the security and performance of the system. This document will introduce how a Node.js and Express.js web server works, how it handles HTTP requests, and how it interacts with clients via the HTTP protocol. Additionally, the document will demonstrate how to use WebSocket and Socket.IO to perform realtime communication between server and client. 

  

The index.js or app.js file: 

  

   

  

This is the main file of the Node.js application, used to create a web server using Express.js. 

  

This file defines the routes and endpoints for the application, handles HTTP requests from the client, and defines middleware. 

  

It manages user authentication via routes like /api/auth and serves static files (e.g. images) via Express.static. 

  

basicAuth.js file: 

  

   

  

This is a middleware module used to authenticate and check user roles on specific routes. 

  

It defines the user's role based on the information provided in the request and ensures that only the user has permission to access parts of the application. 

  

socket.js file: 

  

   

  

This is a Socket.IO module used to manage the WebSocket connection between the server and client. 

  

  

The socket in the socket.js file plays an important role in creating and managing WebSocket connections in the application. First, it is responsible for creating a WebSocket server through the Socket.IO library and listening on a specific port. Then, when the client connects to the WebSocket server, the 'connection' event is fired. In this event, functions are defined to handle server-client interactions via WebSocket. 

  

   

  

WebSocket events like 'createRoom', 'createChannel', 'joinRoom', 'addUser', 'addUserToRoom', 'addChannelToRoom', 'leaveRoom', 'deleteUser', 'getUsersList', 'addUserToChannel', 'deleteRoom', ' message', and 'disconnect' play an important role in managing room creation, joining rooms, managing users, sending messages, and performing other realtime interactions between the server and the client. These functions make the application interactive in a flexible and fun way. 

  

   

  

Finally, the sendUpdatedRoomList function is used to send the updated room list to all clients via WebSocket, ensuring that data is always synchronized and realtime between server and client. 

 

 

Angular: 

  

Angular is used to build the user interface and manage all user and server interactions through services and WebSockets in the application. Routes are configured to navigate users based on login status properly. 

  

   

  

SocketService (socket.service.ts): 

  

   

  

Role: Used to create and manage WebSocket connections via Socket.IO to the server. 

  

Function: 

  

Create a WebSocket connection to the server through the Socket.IO library. 

  

Manage WebSocket events such as sending and receiving messages, joining and leaving rooms, adding and removing rooms and channels, and adding and removing users. 

  

Define events such as creating or deleting a new room or channel. 

  

Transfer data between server and client via WebSocket. 

  

AuthService (auth.service.ts): 

  

   

  

Role: Used to manage user authentication and login status. 

  

Function: 

  

Check if user is logged in using isLoggedin() method. 

  

Authenticate the user through the API using the login(email, pwd) method. 

  

Logout the user using the logout(event) method. 

  

Save and retrieve current user information using localStorage. 

  

LoginComponent (login.component.ts): 

  

   

  

Role: User interface control for the login page. 

  

Function: 

  

Check if the user is logged in when the page is loaded. 

  

Handle the user login event and send the authentication request to the AuthService. 

  

Handles the error display when the login information is incorrect. 

  

ProfileComponent (profile.component.ts): 

  

   

  

Role: Controls the user interface for the profile page and interacts with rooms and channels via WebSocket. 

  

Function: 

  

Displays a list of rooms and channels, allowing users to create, join, and leave rooms and channels. 

  

Send and receive messages in joined rooms or channels. 

  

Interact with user lists and add them to rooms or channels. 

  

Manage existing and new users via WebSocket. 

  

Upload user avatar image. 

  

AuthGuard (auth.guard.ts): 

  

   

  

Role: Checks if the user is logged in before allowing access to specific routes. 

  

Function: 

  

Use AuthService to check user's login status. 

  

Navigate the user to the main or login page if they are not already logged in. 

  

Routes (Routes): 

  

   

  

In Angular, routes are configured in app-routing.module.ts. 

Routes specify URLs and the corresponding element to be displayed when the URL matches that route. 

 
 

AuthGuard usually protects routes to ensure that only logged-in users can access them. 

 
 

Parameters, Return Value: 

 
 

   

 
 

Some methods in services like login, logout, sendMessage, joinRoom, leaveRoom, addUser, deleteUser, and events like roomJoined, userDeleted return data and error messages through Observable. 

 
 

User Interface (Templates): 

 
 

   

 
 

Angular components (components) control the user interface and combine data from services and WebSocket to display information and interact with the user. 

  

  

General comments on how RESTful-API works: 

  

Here are some general comments on how REST API works in this project: 

 
 

   

 
 

API Endpoint: The project defines several API endpoints on the server to handle requests from the client side. These endpoints are usually defined in the server-side file, and HTTP requests from the Angular side are sent to these endpoints to perform operations such as login, registration, user list, and many more operations. . 

 
 

   

 
 

HTTP Methods: RESTAPI uses HTTP methods to perform different operations. In this project, GET, POST, and DELETE are standard methods used to retrieve data, create or delete users, and perform other operations on users and rooms. 

 
 

   

 
 

Data Serialization: Data is transmitted between client and server via JSON (JavaScript Object Notation). When the client sends a POST request, the data is usually wrapped into a JSON object and sent to the server. The server then processes the data, operates, and returns the result as JSON. 

 
 

   

 
 

Authentication: RESTAPIs also typically use authentication mechanisms to ensure that only logged-in users can access protected resources. In the code snippet, you have seen the user authentication by comparing the email and password in the POST request with the data from the database. 

 
 

   

 
 

Response Handling: Requests from the Angular side receive responses from the server, and Angular processes these responses to display information or messages to the user. Responses typically have an HTTP status code to identify the result of the request, along with JSON data containing specific information. 

 
 

   

 
 

Error Handling: RESTAPI also provides mechanism for error handling. In case an error occurs during request processing, the server will return error codes and error messages, and the Angular side can handle these errors to display the appropriate message to the user. 

 
 

   

 
 

In a nutshell, the RESTAPI in this project is responsible for managing and accessing data from the database, providing services such as login, registration, user and room management, and is the interface between the machine side Angular client and server. HTTP requests are used to perform these operations through the defined API endpoints 

 
# Phase 2 :

**Documentation - Data Structures**

The data structure of the project\'s core objects remains very similar
to their design for Phase 1. However, changes are made along the way to
accommodate the natural progression of the design process. Sections of
the phase 1 design document have been adapted to the new standard
formats.

Some data structures play an essential role and have been greatly
improved. That is:

**User data is stored in a MongoDB file.**

Each user contains the following information:

username: Username.

email: Email address.

pwd: User password.

valid: Authentication status (true/false).

avatar: Avatar (string).

role: User role (one or more).

id: User ID (integer).

Function:

authPage(req, res, next):

Goal: Authenticate user with email and password.

Workflow:

Check if the request body contains email and password.

Compare the email and password in the request with the user data from
the JSON file.

If authentication is successful, add user information to req.user and
move on to the next middleware using next().

If authentication fails, return an HTTP error and corresponding message.

authRole(roles):

Workflow:

Check if user information has been added to req.user by the authPage
middleware.

Check the user\'s roles against the roles passed in as an array.

If the user does not have the required role, return an HTTP error and
corresponding message.

To use this middleware, import and apply it to a Node.js application,
such as an Express application. The authPage middleware performs user
authentication, and the authRole middleware checks its role in accessing
specific resources.

Demonstrates how to build a system that authenticates users and verifies
their roles in a Node.js application using user data stored in a MongoDB
file. The authPage and authRole middleware help implement these
functions in the application.\
\
**Objective:** **Model the data structure for rooms in MongoDB**

Room data structure:

id: Room code (integer).

name: Room name (string).

channels: List of channels in the room (array of strings). This allows
the room to have different channels to chat about different topics.

users: List of users in the room (array of integers). Each integer can
represent a user ID.

messages: List of messages in the room (array of message objects).

Each message object includes the following information:

userId: ID of the user who created the message (integer).

username: The name of the user who created the message (string).

text: Message content (string).

Function:

This data structure allows for storing information about chat rooms,
including names, channels, lists of users, and messages in the room. A
room can contain multiple channels and user messages.

After defining this data structure, it can be used in applications to
store information about chat rooms, user management, and messages in the
room.

This data structure helps manage chat rooms in the application. It
stores information about room names, channels, users and messages in
each room, allowing it to build a multi-channel chat system and manage
user messages.

REST API

1.  Upload.js:\
    \
    **Goal:** Build a REST API endpoint to manage image file uploads and
    management.

> REST API structure:
>
> Route: POST /api/upload
>
> Description: This endpoint is used to upload image files to the
> server.
>
> HTTP method: POST
>
> Ingredient:
>
> req: This is the HTTP request sent to the server.
>
> res: This is the HTTP response returned to the client.
>
> Work:
>
> Use the formidable module to handle file uploads.
>
> Defines an uploadFolder folder to store uploaded image files.
>
> Defines settings for the form object, including uploadDir (storage
> directory) and keepExtensions (keep file extensions).
>
> Use form.parse to process the uploaded data and call a callback
> function.
>
> In the callback function:
>
> Check if any errors occurred during file upload and handle them if
> any.
>
> Check if the image file is found in files and files.image is defined.
>
> If the image file exists, move it from the temporary folder to the
> upload folder and rename it according to the original name.
>
> Returns a success response if everything went well.
>
> Function:
>
> This REST API allows users to upload an image file to the server.
>
> It checks and handles errors related to file uploads and processing.
>
> After a successful upload, it returns information about the image file
> including file name and size.
>
> Use:
>
> The POST /api/upload endpoint can be called from the client, providing
> an image file to upload. Then, receive a response with the uploaded
> image file information.
>
> This REST API is simple but essential, allowing the management of
> image file uploads and management on the server. It can be integrated
> into web or mobile applications to allow users to upload and use
> images.

REST API : api-login.js

**Purpose**

> This REST API is designed to handle user authentication requests via
> an HTTP POST request to /api/auth. It interacts with the MongoDB
> database to find user information.

**Project structure**

> Use mongoose library to connect and interact with MongoDB database.
>
> Import the User model from the datauser file to manipulate user data.
>
> Feature
>
> Specify the POST /api/auth route to handle the login request.
>
> Check if the request contains data or not. Otherwise, return status
> code 400 (Bad Request).
>
> Search for users in the database based on email and password
> information from the POST request.
>
> Generate responses based on search results:
>
> If the user is found, send the user information to the client with
> status code 200 (OK).
>
> If the user is not found, send a failure notification to the client
> with status code 200 (OK).
>
> Handle errors safely by logging and returning status code 500
> (Internal Server Error) if an error occurs.

**Advantage**

> Use mongoose technology to connect and interact with MongoDB database.
>
> Handle errors safely by logging errors and returning status code 500
> if an error occurs.

**Summary**

> This REST API provides a simple and effective user authentication
> mechanism through interaction with the MongoDB database.

REST API: socket.js

> **1. Read and Write Data from MongoDB File:**
>
> This code uses to read and write data to and from Mongodb files. User
> and chat room data are stored in the userdata and roomdata files.
>
> **2. Socket.IO Connection:**
>
> This code uses the Socket.IO library to create and manage real-time
> client connections via io.on(\'connection\').
>
> **3. Working with Chat Rooms:**
>
> Functions for chat rooms are defined, including creating a room,
> joining a room, leaving a room, adding users to the room, adding
> channels to the room, and sending messages. To manage these
> operations, the code uses events such as createRoom, joinRoom,
> leaveRoom, addUserToRoom, addChannelToRoom, and messageforroom.
>
> **4. User Operations:**
>
> User-related functions include adding new users, deleting users, and
> updating avatars. Events such as addUser, deleteUser, and updateAvatar
> are used to perform these tasks.
>
> 5\. Broadcast Private Messages:
>
> This code powers private chat by allowing users to open and send
> private messages. The open-private-chat and send-private-message
> events are used for this feature.
>
> **6. Sending Error Messages:**
>
> If an error occurs, the code will emit error messages to the client
> through events such as roomCreationError, joinRoomError,
> userCreationError, and similar events to notify of errors and
> problems.
>
> **7. Send Data Back to Client:**
>
> Events such as socket.emit and io.emit are used to send data and
> messages from the server to the client, including room lists, user
> lists, and error messages.
>
> **8. Disconnection Handling:**
>
> This code also handles the event when the user disconnects. In this
> case, the user will be removed from all rooms in which they
> participated.
>
> **9. Advantages:**
>
> This REST API supports many of the basic features of a real-time chat
> room application, including creating rooms, joining rooms, sending
> messages, managing users and rooms, and private chat features. Error
> messages are also handled well.

  

  

  

  

 

 