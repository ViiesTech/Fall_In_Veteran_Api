const express = require('express')

const AuthController = require('./controllers/AuthController.js')

const checkUserAuth = require('./middleware/Auth_Middleware.js')
const multer = require('multer')
const path = require('path')
const PostController = require('./controllers/PostController.js')
const ChatController = require('./controllers/ChatController.js')


const Route = express.Router()

//multer code upload profile picture
const Profile_Picture_Storage = multer.diskStorage({
    destination: './upload/images/Profile_Picture',
    filename: (req, file, cb) => {
        const splitString = file.mimetype.split('image/')
        cb(null, Date.now() + '.' + splitString[1]);
    }
})


const Profile_Picture_Upload = multer({
    storage: Profile_Picture_Storage
})


//multer code
const Post_Pictures_Storage = multer.diskStorage({
    destination: './upload/images/Post_Pictures',
    filename: (req, file, cb) => {
        const splitString = file.mimetype.split('image/')
        cb(null, Date.now() + '.' + splitString[1]);
    }
})
const Post_Pictures_Upload = multer({
    storage: Post_Pictures_Storage
})


//Middleware Routes
Route.use('/CreatePost', checkUserAuth)
Route.use('/GetAllPost', checkUserAuth)
Route.use('/Like_On_Post', checkUserAuth)
Route.use('/Comment_On_Post', checkUserAuth)
Route.use('/Share_the_Post', checkUserAuth)

Route.use('/getOnlyMyPost', checkUserAuth)
Route.use('/getFriendsPost', checkUserAuth)

Route.use('/getAllChatUsers', checkUserAuth)
Route.use('/getChat', checkUserAuth)



//Authentication Routes
Route.post('/login', AuthController.Login)
Route.post('/Register', Profile_Picture_Upload.single('profile'), AuthController.Register)
Route.post('/sendUserPasswordEmail', AuthController.sendUserPasswordEmail)
Route.post('/VerifyOtp', AuthController.VerifyOtp)
Route.post('/resetForgetPassword', AuthController.resetForgetPassword)

//After Auth Route
Route.post('/CreatePost', Post_Pictures_Upload.single('Post_Picture'), PostController.CreatePost)
Route.get('/GetAllPost', PostController.GetAllPost)
Route.post('/Like_On_Post', PostController.Like_On_Post)
Route.post('/Comment_On_Post', PostController.Comment_On_Post)
Route.post('/Share_the_Post', PostController.Share_the_Post)

Route.get('/getOnlyMyPost', PostController.getOnlyMyPost)
Route.post('/getFriendsPost', PostController.getFriendsPost)

//chat routes
Route.post('/getAllChatUsers', ChatController.getAllChatUsers)
Route.post('/getChat', ChatController.getChat)

module.exports = Route