first connect to db then app.listen

# dev
authRouter
POST /signup
POST /login
POST /logout

profileRouter
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

connectionRequestsRouter
POST /request/send/interested/:userId
POST /request/send/ignore/:userId
POST /request/send/review/accpeted/:requestId
POST /request/send/review/rejected/:requestId

userRouter
GET /user/connections
GET /user/requests
GET /user/feed  - Gets yot the profiles of other users on platform
status : interested ,ignore  accpeted rejected