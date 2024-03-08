const User = require('../models/UserModal.js')
const AllChatUsers = require('../models/ChatUsersModal.js')
const MessageModal = require('../models/MessageModal.js')


class ChatController {

    static getAllChatUsers = async (req, res) => {
        const { id } = req.body



        const existingChats = await AllChatUsers.find({
            $or: [
                { sender_id: id },
                { receiver_id: id },
            ]
        });

        res.send({
            "success": true,
            "data": existingChats
        });
    }


    static getChat = async (req, res) => {
        const { id, FriendId } = req.body




        const existingChats = await MessageModal.find({
            $or: [
                { $and: [{ sender: id }, { receiver: FriendId }] },
                { $and: [{ sender: FriendId }, { receiver: id }] },
            ]
        });

        res.send({
            "success": true,
            "data": existingChats
        });
    }



    
}



module.exports = ChatController;