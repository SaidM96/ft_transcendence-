#ft_transcendence
Backend for project ft_transcendence written with TypeScript framework NestJS.

This API is used to manage users, friendships, blocks, and status updates.

##Authentication
###POST /auth/42

This endpoint is used to authenticate a user via 42 OAuth2 authentication. Upon successful authentication, a JWT token is generated and returned in the response header. This token is then used to authenticate all subsequent requests.

Request: None.
Response:
Status Code: 200
Header: Authorization: Bearer <JWT Token>


##Users
###GET /user/all

This endpoint is used to retrieve a list of all users.

Request:
Header: Authorization: Bearer <JWT Token>
Response:
Status Code: 200
Body: All users.

###GET /user/:login

This endpoint is used to retrieve a specific user by their login.
Request:
Header: Authorization: Bearer <JWT Token>
Param: login - the user's login
Response:
Status Code: 200
Body: User.

###DELETE /user/:login
This endpoint is used to delete a user by their login.
Request:
Header: Authorization: Bearer <JWT Token>
Param: login - the user's login
Response:
Status Code: 200
Body: User.

##friendship

###POST /user/friendship
This endpoint is used to create a friendship between two users.
Request:
Header: Authorization: Bearer <JWT Token>
Body:
{
  "loginA": string,
  "loginB": string,
}
Response:
Status Code: 200

###GET /user/:login/friends
This endpoint is used to retrieve a list of a user's friends.
Request:
Header: Authorization: Bearer <JWT Token>
Param: login - the user's login
Response:
Status Code: 200
Body: Friendship.

###DELETE /user/friendship
This endpoint is used to remove a user friendship from other user.
Request:
Header: Authorization: Bearer <JWT Token>
Body:
{
  "loginA": string,
  "loginB": string,
}

##Blocks
###POST /user/block
This endpoint is used to block a user.
Request:
Header: Authorization: Bearer <JWT Token>
Body:
{
  "login": string,
  "blockedLogin": string,
}
Response:
Status Code: 200

###DELETE /user/block
This endpoint is used to unblock a user.
Request:
Header: Authorization: Bearer <JWT Token>
Body:
{
  "login": string,
  "blockedLogin": string,
}
Response:
Status Code: 200

###GET /user/block/:login
This endpoint is used to retrieve a list of a user's blocked users.
Request:
Header: Authorization: Bearer <JWT Token>
Param: login - the user's login
Response:
Status Code: 200
Body: List of blocked users.

##Status
###GET /user/status/:login
This endpoint is used to retrieve a status of user (login).
Request:
Header: Authorization: Bearer <JWT Token>
Body: status of user.


