const User = require('../models/UserModal.js');



class FriendRequestController {


    static async FriendRequestSend(req, res) {
        const { friendId } = req.body;
        const userData = req.user;


        if (friendId) {

            const userIdExist = await User.findById(friendId).exec();

            if (userIdExist) {

                if (userIdExist.Req.includes(userData._id)) {
                    res.send({
                        "success": false,
                        "message": "Request already sent"
                    });
                } else {
                    try {
                        const updated = await User.findOneAndUpdate(
                            { _id: friendId },
                            { $push: { Req: userData._id } },
                            { new: true } // To return the updated document
                        );

                        const mySendReqListUpdate = await User.findOneAndUpdate(
                            { _id: userData._id },
                            { $push: { ReqSend: friendId } },
                            { new: true } // To return the updated document
                        );



                        if (updated && mySendReqListUpdate) {
                            console.log("Updated user:", updated);
                            return res.send({
                                "success": true,
                                "message": "Friend request sent successfully",
                                "updated_data": mySendReqListUpdate
                            });
                        } else {
                            return res.send({
                                "success": false,
                                "message": "User not found"
                            });
                        }
                    } catch (error) {
                        console.error("Error updating user:", error);
                        return res.send({
                            "success": false,
                            "message": error.message
                        });
                    }
                }

            } else {
                res.send({
                    "success": false,
                    "message": "User not exist"
                });
            }

        } else {
            return res.send({
                "success": false,
                "message": "Friend ID not provided"
            });
        }
    }

    static async GetAllFriendRequest(req, res) {
        const userData = req.user;

        if (userData) {
            const temp = []
            const requestPromises = userData.Req.map(async (id) => {
                const user = await User.findById(id).select('-password -Req -Friends -ReqSend -updatedAt -__v').exec();
                return user;
            });

            const allRequests = await Promise.all(requestPromises);

            const getUpdatedData = await User.findById(userData?._id)


            res.send({
                "success": true,
                "message": "All request",
                "data": allRequests,
                "updated_data": getUpdatedData
            })

        } else {
            res.send({
                "success": false,
                "message": "User not found"
            });
        }
    }

    static async AcceptFriendRequest(req, res) {
        const { friendId } = req.body
        const userData = req.user;


        const getFriend = await User.findById(friendId).exec()

        if (userData.Req.includes(friendId)) {

            if (getFriend) {
                // Pull friendID from the user's Req array
                await User.findByIdAndUpdate(userData._id, { $pull: { Req: friendId } }).exec();

                // Push friendID into the user's Friends array
                await User.findByIdAndUpdate(userData._id, { $push: { Friends: friendId } }).exec();


                await User.findByIdAndUpdate(friendId, { $pull: { ReqSend: userData._id } }).exec();

                // Push friendID into the user's Friends array
                await User.findByIdAndUpdate(friendId, { $push: { Friends: userData._id } }).exec();


                const updatedData = await User.findById(userData._id).exec()

                res.send({
                    "success": true,
                    "message": "Friend request accepted",
                    "updated_data":updatedData
                })

            } else {
                res.send({

                    "success": false,
                    "message": "User not found"

                })
            }
        } else {
            res.send({
                "success": false,
                "message": "Fried request not exist or maybe accepted"
            })
        }

    }

    static async CancelFriendRequest(req, res) {
        const { friendId } = req.body

        const userData = req.user

        const getFriend = await User.findById(friendId).exec()

        if (getFriend) {

            await User.findByIdAndUpdate(userData._id, { $pull: { Req: friendId } }).exec();
            await User.findByIdAndUpdate(friendId, { $pull: { ReqSend: userData._id } }).exec();

            const updatedData = await User.findById(userData._id).exec()

            res.send({
                "success": true,
                "message": "Friend request decline successfully",
                "updated_data": updatedData
            })

        } else {

            res.send({
                "success": false,
                "message": "No friend found"
            })
        }

    }

    static async CancelTheRequestISend(req, res){
        const { friendId } = req.body

        const userData = req.user

        const getFriend = await User.findById(friendId).exec()



        if (getFriend) {

            await User.findByIdAndUpdate(userData._id, { $pull: { ReqSend: friendId } }).exec();
            await User.findByIdAndUpdate(friendId, { $pull: { Req: userData._id } }).exec();

            const updatedData = await User.findById(userData._id).exec()

            res.send({
                "success": true,
                "message": "Friend request decline successfully",
                "updated_data": updatedData
            })

        } else {

            res.send({
                "success": false,
                "message": "No friend found"
            })
        }

    }


    static async unFriendUser(req, res){
        const { friendId } = req.body

        const userData = req.user

        const getFriend = await User.findById(friendId).exec()



        if (getFriend) {

            await User.findByIdAndUpdate(userData._id, { $pull: { Friends: friendId } }).exec();
            await User.findByIdAndUpdate(friendId, { $pull: { Friends: userData._id } }).exec();

            const updatedData = await User.findById(userData._id).exec()

            res.send({
                "success": true,
                "message": "Friend request decline successfully",
                "updated_data": updatedData
            })
            
        } else {

            res.send({
                "success": false,
                "message": "No friend found"
            })
        }
    }

    static async GetAppUsers(req, res) {
        const userData = req.user;

        const getAllUsers = await User.find({ _id: { $ne: userData._id } }).select('-password').exec();

        if (getAllUsers) {

            res.send({
                "success": true,
                "message": "Here's you get the user exist in our app",
                "data": getAllUsers
            })
        } else {
            res.send({
                "success": false,
                "message": "users not exist"
            })
        }
    }

}



module.exports = FriendRequestController