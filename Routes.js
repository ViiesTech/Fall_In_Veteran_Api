const express = require('express')

const AuthController = require('./controllers/AuthController.js')

const checkUserAuth = require('./middleware/Auth_Middleware.js')
const multer = require('multer')
const path = require('path')
const PostController = require('./controllers/PostController.js')
const ChatController = require('./controllers/ChatController.js')
const FriendRequestController = require('./controllers/FriendRequestController.js')
const PageController = require('./controllers/PageController.js')


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


//multer code post images
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


//multer code post images
const PageProfilePicture = multer.diskStorage({
    destination: './upload/images/Page_Profiles',
    filename: (req, file, cb) => {
        const splitString = file.mimetype.split('image/')
        cb(null, Date.now() + '.' + splitString[1]);
    }
})
const Page_Profile_Upload = multer({
    storage: PageProfilePicture
})



//Middleware Routes
Route.use('/getUserData', checkUserAuth)
Route.use('/CreatePost', checkUserAuth)
Route.use('/GetAllPost', checkUserAuth)
Route.use('/Like_On_Post', checkUserAuth)
Route.use('/Comment_On_Post', checkUserAuth)
Route.use('/Share_the_Post', checkUserAuth)

Route.use('/getOnlyMyPost', checkUserAuth)
Route.use('/getFriendsPost', checkUserAuth)

Route.use('/getAllChatUsers', checkUserAuth)
Route.use('/getChat', checkUserAuth)

Route.use('/FriendRequestSend', checkUserAuth)
Route.use('/AcceptFriendRequest', checkUserAuth)
Route.use('/GetAllFriendRequest', checkUserAuth)
Route.use('/GetAppUsers', checkUserAuth)
Route.use('/CancelFriendRequest', checkUserAuth)
Route.use('/CancelTheRequestISend', checkUserAuth)
Route.use('/unFriendUser', checkUserAuth)

Route.use('/CreatePage', checkUserAuth)
Route.use('/GetAllPages', checkUserAuth)
Route.use('/LikePage', checkUserAuth)
Route.use('/PageILiked', checkUserAuth)
Route.use('/GetPagePost', checkUserAuth)


//Authentication Routes
Route.post('/login', AuthController.Login)
Route.post('/Register', Profile_Picture_Upload.single('profile'), AuthController.Register)
Route.post('/sendUserPasswordEmail', AuthController.sendUserPasswordEmail)
Route.post('/VerifyOtp', AuthController.VerifyOtp)
Route.post('/resetForgetPassword', AuthController.resetForgetPassword)
Route.get('/getUserData', AuthController.getUserData)

//After Auth Route
Route.post('/CreatePost', Post_Pictures_Upload.single('Post_Picture'), PostController.CreatePost)
Route.post('/GetAllPost', PostController.GetAllPost)
Route.post('/Like_On_Post', PostController.Like_On_Post)
Route.post('/Comment_On_Post', PostController.Comment_On_Post)
Route.post('/Share_the_Post', PostController.Share_the_Post)

Route.get('/getOnlyMyPost', PostController.getOnlyMyPost)
Route.post('/getFriendsPost', PostController.getFriendsPost)

//chat routes
Route.post('/getAllChatUsers', ChatController.getAllChatUsers)
Route.post('/getChat', ChatController.getChat)

//Friends Request Routes
Route.post('/FriendRequestSend', FriendRequestController.FriendRequestSend)
Route.post('/AcceptFriendRequest', FriendRequestController.AcceptFriendRequest)
Route.get('/GetAllFriendRequest', FriendRequestController.GetAllFriendRequest)
Route.get('/GetAppUsers', FriendRequestController.GetAppUsers)
Route.post('/CancelFriendRequest', FriendRequestController.CancelFriendRequest)
Route.post('/CancelTheRequestISend', FriendRequestController.CancelTheRequestISend)
Route.post('/unFriendUser', FriendRequestController.unFriendUser)

//Page Request Routes
Route.post('/CreatePage', Page_Profile_Upload.single('Page_Profile'), PageController.CreatePage)
Route.get('/GetAllPages', PageController.GetAllPages)
Route.post('/LikePage', PageController.LikePage)
Route.get('/PageILiked', PageController.PageILiked)
Route.post('/GetPagePost', PageController.GetPagePost)




module.exports = Route