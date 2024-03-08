const mongoose  = require("mongoose");



const ChatUsersSchema = mongoose.Schema({
  
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    sender_data: {
        type: Object,
    },
    reciver_data: {
        type: Object,
    },
    LastMessage: {
        type: String,
    },

    timestamp: {
        type: Date,
        default: Date.now
    },
})

const ChatUsers = mongoose.model('ChatUsers', ChatUsersSchema)

module.exports  = ChatUsers;