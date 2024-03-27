const mongoose = require('mongoose');

const PostModal = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        require: true,
    },
    Profile_Picture: String,
    name: String,
    Post_Text: String,
    Post_Image: {
        type: String,
        require: false
    },
    Post_Like:[{
        myId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
        },
        PostReaction: String,
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post', // Reference to the
        },
    }],

    Post_Share: [],
    All_Comments_On_Post: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Reference to the User model
            },
            Comment: String,
            Userpicture: String,
            Created_at: String,
            Username: String
        }
    ],
    comunityStatus: {
        type : Boolean,
        require: false
    },
    Page_id:{
        type: mongoose.Schema.Types.ObjectId,
        require: false
    },
    Page_name:{
        type: String,
        require: false
    },
    Page_Profile_Picture:{
        type: String,
        require: false
    }


}, { timestamps: true })

const Post = mongoose.model('Post', PostModal);

module.exports = Post;
